const Gif = require("../models/gif");

exports.addGif = async (req, res) => {
  try {
    const { urls, category } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input: urls must be a non-empty array" });
    }

    const newGifs = urls.map((url) => new Gif({ url, category }));
    await Gif.insertMany(newGifs);

    res.status(201).json({ message: "GIFs added successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding GIFs", error: error.message });
  }
};

exports.getAllGifs = async (req, res) => {
  try {
    const gifs = await Gif.find({}, "url category -_id");
    const formattedGifs = gifs.reduce((acc, gif) => {
      if (!acc[gif.category]) {
        acc[gif.category] = [];
      }
      acc[gif.category].push(gif.url);
      return acc;
    }, {});
    res.json(formattedGifs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching GIFs", error: error.message });
  }
};

exports.deleteGif = async (req, res) => {
  try {
    const { category, url } = req.body;

    if (!category || !url) {
      return res.status(400).json({ message: "Category and URL are required" });
    }

    const result = await Gif.findOneAndDelete({ category, url });

    if (!result) {
      return res.status(404).json({ message: "GIF not found" });
    }

    res.json({ message: "GIF deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting GIF", error: error.message });
  }
};
