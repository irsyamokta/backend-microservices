import axios from "axios";

export const categoryMiddleware = async (req, res, next) => {
    const { categoryId } = req.body;
    const authHeader = req.headers.authorization;

    if (!categoryId) {
        return res.status(400).json({ message: "categoryId is required" });
    }

    try {
        const { data } = await axios.get(`http://localhost:8001/api/v1/category/${categoryId}`, {
            headers: { Authorization: authHeader },
            timeout: 3000,
        });

        const userId = data.category.userId;

        if (userId != req.user.id) {
            return res.status(403).json({ message: "Forbidden - category does not belong to you" });
        }

        next();
    } catch (err) {
        console.error("Category verification error:", err.message);
        return res.status(404).json({ message: "Category not found or unavailable" });
    }
};