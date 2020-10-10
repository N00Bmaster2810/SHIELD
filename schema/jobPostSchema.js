const mongoose = require("mongoose");

const jobPost = new mongoose.Schema(
	{
		jobOffer: {
		  type: String,
			require: true
		},
		description: {
			type: String,
			require: true
		},
		tags: {
			type: String,
			require: true
		}
	  
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", jobPost);