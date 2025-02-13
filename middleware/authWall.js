  import Admin from "../models/admin.js";
  import Client from "../models/client.js";
  import { verifyToken } from "../utils/token.js";

  // export const requireSignIn = async (req, res, next) => {
  //   try {
  //     const header = req.headers.authorization;
  //     if (!header || !header.startsWith("Bearer ")) {
  //       return res.status(401).json({ message: "Unauthorized: No token provided" });
  //     }

  //     const token = header.split(" ")[1]; // Correct splitting
  //     if (!token) {
  //       return res.status(401).json({ message: "Unauthorized: Token missing" });
  //     }

  //     const decoded = verifyToken(token); // Should return { userId, role }
  //     if (!decoded || !decoded.userId) {
  //       return res.status(401).json({ message: "Unauthorized: Invalid token" });
  //     }

  //     // Check if user exists (Admin or Client)
  //     let user = await Admin.findById(decoded.userId);
  //     if (!user) {
  //       user = await Client.findById(decoded.userId);
  //       if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //       }
  //     }

  //     req.user = user; // Attach user data to request
  //     next();
  //   } catch (error) {
  //     return res.status(500).json({ message: "Server Error: " + error.message });
  //   }
  // };


  export const requireSignIn = async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = header.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
      }

      const decoded = verifyToken(token);

      if (!decoded || !decoded.user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      let user = await Admin.findById(decoded.user) || await Client.findById(decoded.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server Error: " + error.message });
    }
  };


  export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only!" });
    }
    next();
};

