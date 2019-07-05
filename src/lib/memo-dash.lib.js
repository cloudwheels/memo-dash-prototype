import DAPIClient from "@dashevo/dapi-client"
import DashPlatformProtocol from "@dashevo/dpp"
import {
  Transaction,
  PrivateKey,
  PublicKey,
  Address
} from "@dashevo/dashcore-lib"

import memoDashContract from "./memo-dash.contract"

import DPALib from "@dashevo/dpa-lib"

export default class MemoDashLib {
  constructor(networkType, seeds, contractName, faucetPrivateKey) {
    this.faucetPrivateKey = new PrivateKey(faucetPrivateKey)
    const faucetPublicKey = PublicKey.fromPrivateKey(this.faucetPrivateKey)
    this.faucetAddress = Address.fromPublicKey(
      faucetPublicKey,
      networkType === "devnet" ? "testnet" : networkType
    ).toString()

    this.dpaLib = new DPALib(this.faucetPrivateKey, { seeds })

    // this.dpp = new DashPlatformProtocol();
    // this.dapiClient = new DAPIClient({
    //   seeds,
    //   timeout: 30000
    // });
    //
    //
    //
    // // this.dpaUserPrivateKey = dpaUserPrivateKey;
    // this.dpaUserPrivateKey = "9b932e4951a5a3d5d04b38783397e5de04fb1a06407a6255bd489d4ad3f4ff95";
    //
    //
    // this.dpp.setContract(
    //   this.dpp.contract.create(contractName, memoDashContract)
    // );
  }

  async createProfile(regTxId, userPrivateKey, name, address) {
    const profile = this.dpp.document.create("profile", {
      name,
      address
    })

    const result = this.dpp.document.validate(profile)
    if (!result.isValid()) {
      throw new Error(`The profile is not valid ${JSON.stringify(result)}`)
    }

    profile.removeMetadata()

    const stPacket = this.dpp.packet.create([profile])
    // await this.dapiClientWrapper.publishUserProfile(stPacket);
  }

  /**
   * Search for blockchain users who match a given search pattern
   * @param {string} username - Username
   * @returns {array} Array of matching blockchain user accounts
   */
  async getUserByName(username) {
    return await this.dpaLib.getUserByName(username)
    // return await this.dapiClient.searchUsers(pattern);
  }

  /**
   Authenticate to the MemoDash DAP
   * @param {object} config - Configuration object { blockchainUsername: "usernameGoesHere" }
   */
  async login(user) {
    this.currentUser = user
    // await this.dpp.setUserId(this.currentUser.userId)
    this.isAuthed = true
  }

  async logout() {
    this.currentUser = undefined
    this.dpp.setUserId(undefined)
    this.isAuthed = false
  }

  /**
   * Get an array with users
   *
   * @param usernames
   * @return {Promise<Array<{
   * {
   *   username,
   *   { username, bio, avatarUrl, followersCount, followingCount, likesCount },
   *   userId
   * }
   * }>>}
   * @memberof MemoDashLib
   */
  async getUsers(usernames) {
    const getUserPromises = []
    for (const username of usernames) {
      getUserPromises.push(this.getUser(username))
    }
    return await Promise.all(getUserPromises)
  }

  /**
   * Get an array with all available users
   *
   * @return {Promise<Array<{
   * {
   *   username,
   *   { username, bio, avatarUrl, followersCount, followingCount, likesCount },
   *   userId
   * }
   * }>>}
   * @memberof MemoDashLib
   */
  async getAllUsers() {
    return await this.dapiClient.searchUsers("")
  }

  /**
   * Returns user id for the given username.
   * @param {string} username
   * @return {Promise<string>}
   */
  async getUserId(username) {
    const user = await this.dapiClient.getUserByName(username)
    return user ? user.regtxid : undefined
  }

  async getUserProfile(username) {
    // const profile = await this.dpaLib.getDocum
    // const [profile, userId, followers, following, likes] = await Promise.all([
    //   this.memoDashClient.getUserProfile(username),
    //   this.memoDashClient.getUserId(username),
    //   this.memoDashClient.getUserFollowers(username),
    //   this.memoDashClient.getUserFollowing(username),
    //   this.getUserLikes(username)
    // ])
    //
    // return {
    //   username,
    //   profile,
    //   userId,
    //   followers: followers ? followers.map(user => user.username) : undefined,
    //   following: following ? following.map(user => user.username) : undefined,
    //   likes
    // }
  }

  /**
   * Get a single user
   *
   * @param username
   * @returns
   * {
   *   username,
   *   { username, bio, avatarUrl, followers, following, likes },
   *   userId
   * }
   */
  async getUser(username) {
    const userId = await this.getUserId(username)

    if (!userId) {
      throw new Error("User not found")
    }

    const [profile] = await Promise.all([this.getUserProfile(userId)])

    return {
      username,
      profile,
      userId
      //   followers: followers ? followers.map(user => user.username) : undefined,
      //   following: following ? following.map(user => user.username) : undefined,
      //   likes
    }

    // const [profile, userId, followers, following, likes] = await Promise.all([
    //   this.memoDashClient.getUserProfile(username),
    //   this.memoDashClient.getUserId(username),
    //   this.memoDashClient.getUserFollowers(username),
    //   this.memoDashClient.getUserFollowing(username),
    //   this.getUserLikes(username)
    // ])
    // return {
    //   username,
    //   profile,
    //   userId,
    //   followers: followers ? followers.map(user => user.username) : undefined,
    //   following: following ? following.map(user => user.username) : undefined,
    //   likes
    // }
  }

  async getUserProfile(userId) {
    return await this.dapiClient.fetchDocuments(
      this.dpp.getContract().getId(),
      "profile",
      {
        where: { _id: userId }
      }
    )
  }

  async getUserFollowers(userId) {}

  async updateProfile(bio) {
    // await this.memoDashClient.updateProfile({ text: bio })
  }

  /**
   * Returns all memos for a user
   *
   * @param {string} username
   * @return {Promise<Array<{
   *   username,
   *   memoDatetime,
   *   memoText,
   *   memoLikesCount,
   *   memoTipTotal,
   *   memoRepliesCount
   * }>>}
   * @memberof MemoDashLib
   */
  async getMemosForUser(username) {
    // return await this.memoDashClient.getMemosByUsername(username)
  }

  /**
   * Get a specific Memo
   * @param {string} username
   * @param {number} memoId
   * @returns
   * Promise<{
   *   username,
   *   idx,
   *   memoDatetime,
   *   memoText,
   *   memoLikesCount,
   *   memoTipTotal,
   *   memoRepliesCount,
   *   avatarUrl
   * }>
   */
  async getMemo(username, memoId) {
    // return await this.memoDashClient.getMemo(username, memoId)
  }

  /**
   * Returns memos
   *
   * @param {Array<{username, idx}>} memoIds
   * @return {Promise<Array<{
   *   username,
   *   memoDatetime,
   *   memoText,
   *   memoLikesCount,
   *   memoTipTotal,
   *   memoRepliesCount
   * }>>}
   * @memberof MemoDashLib
   */
  async getMemos(memoIds) {
    // if (memoIds) {
    //   return await Promise.all(memoIds.map(memoId => this.getMemo(memoId.username, memoId.idx)))
    // }
    // return await this.memoDashClient.getMemos()
  }

  /**
   * Like a memo
   *
   * @param {string} username - username of user who posted the memo
   * @param {string} memoId - memo id
   * @memberof MemoDashLib
   */
  async likeMemo(username, memoId) {
    // await this.memoDashClient.likeMemo(username, memoId)
  }

  /**
   * Reply to a given memo
   *
   * @param {*} username - username of user who posted the memo
   * @param {*} memoId - memo id
   * @param {*} message - reply message
   * @memberof MemoDashLib
   */
  async replyToMemo(username, memoId, message) {
    // const answer = await this.memoDashClient.replyToMemo(username, memoId, message)
    // return answer
  }

  /**
   *
   *
   * @param {*} username
   * @param {*} memoId
   * @returns
   * [{
   *   username,
   *   memoDatetime,
   *   memoText,
   *   memoLikesCount,
   *   memoTipTotal,
   *   memoRepliesCount
   * }]
   * @memberof MemoDashLib
   */
  async getMemoReplies(username, memoId) {
    // return await this.memoDashClient.getMemoReplies(username, memoId)
  }

  /**
   * Post memo to your profile.
   * @param {string} message
   * @return {Promise<boolean>}
   * @memberof MemoDashLib
   */
  async postMemo(message) {
    // await this.memoDashClient.postMemo(message)
  }

  /**
   * Removes memo context
   * @param {string} memoId
   * @return {Promise<boolean>}
   * @memberof MemoDashLib
   */
  async deleteMemo(memoId) {
    // await this.memoDashClient.deleteMemo(memoId)
  }

  /**
   * Edit own memo at the given infex
   * @param {string} idx
   * @param {string} newMessage
   * @return {Promise<boolean>}
   * @memberof MemoDashLib
   */
  async editMemo(memoId, message) {
    // await this.memoDashClient.editMemo(memoId, message)
  }

  /**
   * Remove like from memo
   *
   * @param {string} likeId
   * @memberof MemoDashLib
   */
  async removeLike(likeId) {
    // await this.memoDashClient.removeLike(likeId)
  }

  /**
   * Get all likes of a user
   * @returns {Promise<Array<{
   *  idx,
   *  relation
   * }>>}
   * @memberof MemoDashLib
   */
  async getUserLikes(username) {
    // const likes = await this.memoDashClient.getUserLikes(username)
    // return await Promise.all(
    //   likes.map(async like => {
    //     like.relation.username = await this.memoDashClient.getUsername(like.relation.userId)
    //     return like
    //   })
    // )
  }

  /**
   * Get followers of a user
   * @returns
   * [{
   *   username
   * }]
   * @memberof MemoDashLib
   */
  async getUserFollowers(username) {
    // return await this.memoDashClient.getUserFollowers(username)
  }

  /**
   * Get users followed by a user
   * @returns
   * [{
   *   username
   * }]
   * @memberof MemoDashLib
   */
  async getUserFollowing(username) {
    // return await this.memoDashClient.getUserFollowing(username)
  }

  /**
   * Follow a user
   * @param {string} username
   * @return {Promise<boolean>}
   */
  async followUser(username) {
    // return await this.memoDashClient.followUser(username)
  }

  /**
   * Unfollow user
   * @param {string} username
   * @return {Promise<boolean>}
   */
  async unFollowUser(username) {
    // return await this.memoDashClient.unFollowUser(username)
  }
}
