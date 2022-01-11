function getIndex(req, res) {
  res.render("index", { pageTitle: "gusto-Blogs" });
}

export default { getIndex };
