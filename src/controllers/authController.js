import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js"
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    const { email, name, password } = req.body;

    // Check if the user already exists
    const userExists = await prisma.user.findUnique({ where: { email: email } });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(404).json({
            message: "Invalid email or password"
        });
    }

    // Check if password is correct 
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(404).json({
            message: "Invalid email or password"
        });
    }

    // Generator token
    const token = generateToken(user.id, res);

    return res.status(200).json({
        message: "Logged in successfully",
        user: {
            id: user.id,
            email: user.email,
        },
        token
    });
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0)
    })
    res.status(200).json({
        message: "Logged out successfully"
    })
}

const getme = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        return res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { register, login, logout, getme };