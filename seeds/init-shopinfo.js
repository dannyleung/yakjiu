exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('shopinfo').insert([
        {id: 1, _clientid: 1, address: "Shopping Arcade of Convention Plaza, Wanchai, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-Convention Plaza", credit: 50, quota: 8, description:'Some test shop',taken:[84,34], status:"Live"},
        {id: 2, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2019-01-01", enddate: "2019-12-30", 
        question1: "What the shop look like?" , question2: ["How many staff are in when you going", "1","2","3","4 or more"] , question3: ["Comment on the goods:", "cheap", "userfriendly", "look pretty", "smelly"],
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Another testing shop'},
        {id: 3, _clientid: 1, address: "太古城中心4樓410號舖", startdate: "2018-12-11", enddate: "2018-12-24", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-Convention Plaza", credit: 30, quota: 8, description:'電器鋪',taken:[1,5], status:"Live"},
        {id: 4, _clientid: 2, address: "981 King's Rd, Quarry Bay", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload staff face with his/her nametag" , shopname: "Mannings Plus", credit: 20, quota: 10, description:'shit in my month',taken:[], status:"Live"},
        {id: 5, _clientid: 2, address: "981 King's Rd, Quarry Bay", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload staff face with his/her nametag" , shopname: "Mannings Plus (no live)", credit: 20, quota: 10, description:'shit in my month',taken:[], status:"Pending"}

      ]);
    });
};
