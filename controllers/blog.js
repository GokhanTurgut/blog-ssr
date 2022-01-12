function getIndex(req, res) {
  res.render("index", { pageTitle: "gusto-Blogs" });
}

function getAddPost(req, res) {
  res.render('blog/addPost', {
    pageTitle: 'Add Post'
  })
}

export default { getIndex, getAddPost };
