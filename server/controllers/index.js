module.exports.getTexts = (req, res) => {
  // console.log("inside getTexts.js");
  console.log('REQ.SESSION:',req.session);
  res.json({msg: 'Connected!'})
};

module.exports.postText = (req, res) => {
  console.log(req.body.msg);
  console.log('TEXT POSTED')
  res.status(200).end();
}

