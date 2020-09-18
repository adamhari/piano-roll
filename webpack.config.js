module.exports = {
	module: {
		rules: [
			{
				test: /\.(woff2|woff|eot|ttf|otf)$/,
				use: ['file-loader'],
			},
		],
	},
};
