function getIndex(req, res) {
  res.render("index", { pageTitle: "Blog" });
}

export default { getIndex };
