import Jwt from "jsonwebtoken";
import cookie from "cookie"

const isAuthenticated = async (req, res, next) => {
  try {
   
  
    const token = req.cookies.token;
  

    if (!token) {
      return res.status(401).json({ message: "User not Authenticated", success: false });
    }
    console.log("error")


    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token", success: false });
    }

  
    req.id = decoded.userId;


    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Authentication failed", success: false });
  }
};

export default isAuthenticated;