import { User } from "../Models/user.model.js";

const register = async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body;

    try {
        console.log('register API req.body', req.body)

        const emailTaken = await User.findOne({ email });
        if (emailTaken && emailTaken.isActive === true) {
            return res.status(400).json({
                status: false,
                message: "Email already exists. Please use a different email.",
            });
        }

        const usernameTaken = await User.findOne({ username });
        if (usernameTaken && usernameTaken.isActive === true) {
            return res.status(400).json({
                status: false,
                message: "Username already exists. Please choose a different username.",
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        console.log(existingUser, "existingUser in starting");

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ status: false, message: "Email already exists." });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ status: false, message: "Username already exists." });
            }
        }

        let adminData = {
            "email": email,
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
            "password": password,
            "role": "user",
            "isActive": false,
        }

        if (req.body.avatar) {
            adminData.avatar = 'avatar/' + req.body.avatar;
        }

        const newUser = new User(adminData);
        await newUser.save();

        res.status(200).send({
            status: true,
            message: 'User registered successfully.',
            User: newUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: false,
            message: 'Error registering user',
        });
    }
}

export {
    register
}