import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Token invalid" });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error("Error in authenticateToken:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateToken;
