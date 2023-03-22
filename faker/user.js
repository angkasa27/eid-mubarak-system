import User from "../models/User.js";
import { faker } from "@faker-js/faker";

const run = async (limit) => {
  try {
    let data = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        fullname: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    }

    const fakeData = await User.insertMany(data);
    // const user = new User({
    //   fullname: faker.name.fullName(),
    //   email: faker.internet.email(),
    //   password: faker.internet.password(),
    // });

    // const newUser = await user.save();

    if (fakeData) console.log(fakeData);
  } catch (error) {
    console.log("fail");
  }
};

export { run };
