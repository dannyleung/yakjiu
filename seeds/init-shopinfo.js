exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('shopinfo').insert([
        {id: 1, _clientid: 1, address: "Shopping Arcade of Convention Plaza, Wanchai, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["How many staff did you see?", "1", "2", "3", "None"] , question3: ["Which of the following is true?", "The shop is clean", "The staff is dressed in uniform", "The display of products is well organized", "The music is playing"],
        question4: "Upload a photo of the store-front" , shopname: "Godiva Hong Kong-Convention Plaza", credit: 50, quota: 8, description:'<u>Visit Scenario</u><br><br>Once you are approached by a Salesperson, you need to tell him/her that you would like to purchase chocolate for yourself. Pay attention when the SA talks about Godiva and its products.',taken:[], status:"Live"},
        {id: 2, _clientid: 1, address: "In-App: Deliveroo, Hong Kong", startdate: "2019-01-01", enddate: "2019-12-30", 
        question1: "Where you able to make a purchase using the App via Google Pay? (If not, what issues did you encounter)" , question2: ["What android version is your phone using?", "Marshmallow (6.xxx)","Nougat (7.xxx)","Oreo (8.xxx)","Pie (9.0)"] , question3: ["Which payment options did are available did you see?", "Google Pay", "Android Pay", "Mastercard", "Visa"],
        question4: "Upload a screenshot of your Google Pay receipt" , shopname: "Google Pay: In-App", credit: 50, quota: 10, 
        description:'Each shopper can only shop each merchant once within a 30 day period.',taken:[]},
        {id: 3, _clientid: 1, address: "Lobby Lounge, Intercontinental Hotel, Hong Kong", startdate: "2018-12-11", enddate: "2018-12-24", 
        question1: "Were you approached upon arrival to the Lobby Lounge area? (If Yes, how were you greeted? If Not, what happened/did you do?)" , question2: ["Lobby Lounge is similar to which other hotel you compare to?", "Mandarin Oriental", "W Hotel", "Ritz Carlton", "Island Shangri-La"] , question3: ["Which of the following is true?", "Staff is courteous", "Food quality is good", "Music level is acceptable", "Seating & Table is clean"],
        question4: "Upload a photo of the view from your seat" , shopname: "Hotel Lobby Research", credit: 30, quota: 8, description:'Survey for Hotel Lobby areas <br><br>When entering the Hotel go to any venue/seating area and make note of the service provided.<br><br>Order food & a drink. Take note of the staff and level of service provided.',taken:[], status:"Live"},
        {id: 4, _clientid: 2, address: "981 King's Rd, Quarry Bay", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload staff face with his/her nametag" , shopname: "Mannings Plus", credit: 20, quota: 10, description:'shit in my month',taken:[], status:"Live"},
        {id: 5, _clientid: 2, address: "981 King's Rd, Quarry Bay", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: ["Do you like the shop?", "Yes", "No", "I dont think so", "No comment"] , question3: ["Which of the following is true?", "The shop is clear", "The staff is nice", "The shop location is good", "It's clear"],
        question4: "Upload staff face with his/her nametag" , shopname: "Mannings Plus (no live)", credit: 20, quota: 10, description:'shit in my month',taken:[], status:"Pending"}

      ]);
    });
};
