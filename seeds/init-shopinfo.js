exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('shopinfo').insert([
        {id: 1, _clientid: 1, address: "Shop No. 102A & 102B, 1st Floor, Shopping Arcade of Convention Plaza, Wanchai, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-Convention Plaza", credit: 50, quota: 10, description:'Some test shop',taken:[84,34], status:"Live"},
        {id: 2, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2019-01-01", enddate: "2019-12-30", 
        question1: "What the shop look like?" , question2: ["How many staff are in when you going", "1","2","3","4 or more"] , question3: ["Comment on the goods:", "cheap", "userfriendly", "look pretty", "smelly"],
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Another testing shop'}

      ]);
    });
};
