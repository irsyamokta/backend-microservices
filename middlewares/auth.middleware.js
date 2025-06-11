import axios from "axios";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - no access token" });
    }

    try {
        const response = await axios.get("http://localhost:8000/api/v1/auth/me", {
            headers: { Authorization: authHeader },
            timeout: 3000,
        });

        req.user = response.data;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(403).json({ message: "Unauthorized - token invalid" });
    }
};