const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  phone: state => state.user.phone,
  intro: state => state.user.intro,
  username: state => state.user.username,
  id: state => state.user.id,
  userinfo: state => state.user.userinfo
}
export default getters
