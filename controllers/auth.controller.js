const { loginService } = require("../services/auth.service");

const login = async (req, res) => {
    const { email, password } = req.body;

    const results = await loginService(email, password);

    res.status(200).json({
        status: "success",
        message: "Login successful",
        data: results,
    });
};

const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    const results = await registerService(username, email, password, role);

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: results,
    });
};

module.exports = { login, register };