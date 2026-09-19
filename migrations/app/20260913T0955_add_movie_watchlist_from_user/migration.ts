#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/d0023bd66aa4fb80f0d2fa41e0dda6f2c4e96fda3adb82a9a35d13cd4abe6a05/contract';
import startContract from '../../snapshots/d0023bd66aa4fb80f0d2fa41e0dda6f2c4e96fda3adb82a9a35d13cd4abe6a05/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ebb1205f71e3e8de795a84e2c82844b5adf59f3e936ac21900a9f7f510207def/contract';
import endContract from '../../snapshots/ebb1205f71e3e8de795a84e2c82844b5adf59f3e936ac21900a9f7f510207def/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'movie',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdBy', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('genres', 'text[]', {
            notNull: true,
            default: lit([]),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('overview', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('posterUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('releaseDate', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('runtime', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'movie_genres_elem_not_null_6dc02271',
            'array_position("genres", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'watchlistItem',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('movieId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PLANNED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'watchlistItem_status_check_96b071fd',
            "\"status\" IN ('PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED')",
          ),
        ],
      }),
      this.setDefault({
        schema: 'public',
        table: 'user',
        column: 'updatedAt',
        defaultSql: 'DEFAULT (now())',
      }),
      this.createIndex({
        schema: 'public',
        table: 'movie',
        index: 'movie_createdBy_idx_ba0f792f',
        columns: ['createdBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'watchlistItem',
        index: 'watchlistItem_movieId_idx_8cb9f9db',
        columns: ['movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'watchlistItem',
        index: 'watchlistItem_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'movie',
        foreignKey: {
          name: 'movie_createdBy_fkey',
          columns: ['createdBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'watchlistItem',
        foreignKey: {
          name: 'watchlistItem_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'watchlistItem',
        foreignKey: {
          name: 'watchlistItem_movieId_fkey',
          columns: ['movieId'],
          references: { schema: 'public', table: 'movie', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
