const userResolver = {
  Query: {
    users: (parent, args, { db }) => {
      // return 안 해주면 적용 안 됨. 실제 messages는 모두 return을 해주고 있음.
      // 강사님은 중괄호를 사용하지 않아서 자동 return이 되는 거였음....
      return Object.values(db.users);
    },
    user: (parent, { id }, { db }) => {
      return db.users[id];
    },
  },
};

export default userResolver;

// const userResolver = {
//   Query: {
//     users: (parent, args, { db }) => Object.values(db.users),
//     user: (parent, { id }, { db }) => db.users[id],
//   },
// };

// export default userResolver;
