const generateToken = (lenght = 6) => {
  let num = "";
  for (let i = 0; i < lenght; i++) {
    let randNum = Math.floor(Math.random() * 10);
    num = num.concat(randNum.toString());
  }

  return num;
};

const formatProfile = (user) => {
  const {
    _id: userId,
    name,
    email,
    verified,
    avatar,
    followers,
    followings,
  } = user;

  return {
    userId,
    name,
    email,
    verified,
    avatar: avatar?.url,
    followers: followers.length,
    followings: followings.length,
  };
};

module.exports = { generateToken, formatProfile };
