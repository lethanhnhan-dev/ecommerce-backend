const User = require("../models/user");

exports.userById = (req, res, next, id) => {
	User.findById(id).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: "User not found!",
			});
		} else {
			req.profile = user;
			next();
		}
	});
};

exports.getProfileUser = (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

exports.updateProfileUser = (user, res) => {
	User.findOneAndUpdate(
		{ _id: user.profile._id },
		{ $set: user.body },
		{ new: true },
		(error, user) => {
			if (error) {
				return res.status(400).json({
					error: "You are not authorized to perform this action!",
				});
			}
			user.hashed_password = undefined;
			user.salt = undefined;
			res.json(user);
		}
	);
};
