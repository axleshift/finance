import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Error" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.body.userId.role)) {
      return res.sendStatus(403);
    }

    next();
  };
};

const financeOnly = (req, res, next) => {
  if (req.user && req.user.role === "finance") {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};

export { authMiddleware, authorizeRoles, financeOnly };
