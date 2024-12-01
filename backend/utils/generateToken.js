import jwt from "jsonwebtoken";

const generateToken = ({ userId }) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "12h" } // Token expires in 12 hours
  );
};

export default generateToken;
