const errorHandler = (err, req, res, next) => {
  console.log(err)
  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "accountExisted":
      res.status(400).json({ message: "Email is already registered" });
      break;
    case "badLoginReq":
      res.status(400).json({ message: "Please insert Email/Password" });
      break;
    case "unauthorizedLogin":
      res.status(401).json({ message: "Invalid Email/Passowrd" });
      break;
    case "unauthorizedUser":
      res.status(401).json({ message: "Invalid token" });
      break;
    case "reqNotFound":
      res.status(404).json({ message: "Request not found" });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = { errorHandler };
