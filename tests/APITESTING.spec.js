
import {test,expect} from '@playwright/test';
import { testData } from '../PageObjects/DataDrivenTesting.js';



test.describe.configure({mode:'serial'});


async function getDataByID(request,bookingId) {
  
  const response=await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{
    
    headers:{
      "Accept":"application/json",
    }

  });
  return response;
  
  // expect(await response.status()).toBe(200);
  
  // console.log(await response.json());
}


let token;

// Login API
test('Login and generating Token',async ({request})=>{
  const response=await request.post("https://restful-booker.herokuapp.com/auth",{

                  headers:{
                    "Content-Type":"application/json"

                  },
                  data:{
                    "username":"admin",
                    "password":"password123"
                  }
  });

  
  const responseJson=await response.json();
  console.log(await responseJson)
  expect(response.status()).toBe(200);

  token=await responseJson.token;

})


// GET ALL Id's
let id;

test('Get all ids',async ({request})=>{

  const response=await request.get("https://restful-booker.herokuapp.com/booking");

  expect(await response.status()).toBe(200);

  console.log(await response.json());

  const responseJson=await response.json();
  id=await responseJson[10].bookingid;
  console.log( response.status());
  
})




//Adding Data
let bookingId;

test('Post',async ({request})=>{
  
  const response=await request.post("https://restful-booker.herokuapp.com/booking",{
    
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    
                data:{
                    "firstname" : "prashanth reddy",
                    "lastname" : "Gaddam",
                    "totalprice" : 462,
                    "depositpaid" : false,
                    "bookingdates" : {
                        "checkin" : "2026-01-08",
                        "checkout" : "2026-01-08"
                    },
                    "additionalneeds" : "Breakfast and lunch"
                }
  })

  const responseJson=await response.json();
  bookingId=await responseJson.bookingid;
  console.log( response.status());

  console.log('post bookig id is',bookingId)

  // console.log(await responseJson);

  expect( response.status()).toBe(200);


})


// GET DATA BY ID

test('Get Data by using id',async ({request})=>{

  const response=await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{

    headers:{
      "Accept":"application/json",
    }
  });

  expect(await response.status()).toBe(200);

  console.log(await response.json());
})



// UPDATING THE DATA
test('put ',async ({request})=>{

  const response=await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{

                      headers:{
                        "Content-Type":"application/json",
                        "Accept":"application/json",
                        "Cookie":`token=${token}`,
                      },
                      data:{
                        "firstname" : "prashanth reddy",
                        "lastname" : "Gaddam",
                        "totalprice" : 10742790,
                        "depositpaid" : true,
                        "bookingdates" : {
                            "checkin" : "2027-01-07",
                            "checkout" : "2027-01-07"
                        },
                        "additionalneeds" : "Food"
                }
  })

  const responseJson=await response.json();
  // const id=await responseJson.bookingid;
  // console.log(responseJson);
  // console.log('put booking id', id, await response.status());  // it is not necessary that put or patch return a id
  expect(response.status()).toBe(200);
  // CHECKING THE UPDATED DATA
  expect(await responseJson.totalprice).toBe(10742790);
  expect(await responseJson.bookingdates.checkin).toBe("2027-01-07");
  expect(await responseJson.bookingdates.checkout).toBe("2027-01-07");

  console.log("Calling the Get Function")
  await getDataByID(request,bookingId);

})



// PARTIAL UPDATE
test('patch', async ({request})=>{

  const response=await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{

                            headers:{
                              "Content-Type":"application/json",
                              "Accept":"application/json",
                              "Cookie":`token=${token}`,
                            },
                            data:{
                              "firstname" : "John",
                              "lastname" : "wick"
                            }

  })

  const responseJson=await response.json();
  // const id=await responseJson.bookingid;
  console.log(responseJson);

  expect(response.status()).toBe(200);

  expect(responseJson.firstname).toBe("John");
  expect(responseJson.lastname).toBe("wick");
})


// DELETING THE DATA
test('delete ',async ({request})=>{

  const response=await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{
                  headers:{
                              "Content-Type":"application/json",
                        
                              "Cookie":`token=${token}`,
                            },
  })

  expect(response.status()).toBe(201);

})

test('404 validation',async ({request})=>{

  const response=await getDataByID(request,bookingId);
  expect(response.status()).toBe(404);
  console.log(await response.status());
})





test('Post without firstName',async ({request})=>{
  
  const response=await request.post("https://restful-booker.herokuapp.com/booking",{
    
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    
                data:{
                    "lastname" : "bruce",
                    "totalprice" : 6700,
                    "depositpaid" : true,
                    "bookingdates" : {
                        "checkin" : "2026-01-08",
                        "checkout" : "2026-01-08"
                    },
                    "additionalneeds" : "Dinner"
                }
  })

  const responseText=response.text();
  console.log(await responseText);
  // bookingId=await responseJson.bookingid;

  expect(await responseText).toBe("Internal Server Error");
  // console.log( response.status());

  // console.log('post bookig id is',bookingId)

  // // console.log(await responseJson);

  expect(response.status()).toBe(500);


})

test.describe('Driven driven missing fields testing',async ()=>{

  for(const testdata of testData){

    test(testdata.name, async ({request})=>{
      const response=await request.post("https://restful-booker.herokuapp.com/booking",{

                headers:{
                  "Content-Type":"application/json",
                  "Accept":"application/json"
                },
                data:{
                  ...testdata.data,
                  "totalprice" : 6700,
                    "depositpaid" : true,
                    "bookingdates" : {
                        "checkin" : "2026-01-08",
                        "checkout" : "2026-01-08"
                    },
                    "additionalneeds" : "Dinner"


                }
      })

      if(testdata.name==="Empty First name"){
        const responseJson=response.json();
        // await expect(await responseJson.firstname).toBe("");
        // console.log(await responseJson.firstname);
        expect(response.status()).toBe(200);

      }else{
        const responseText=response.text();
        expect(await responseText).toBe("Internal Server Error");
        expect(response.status()).toBe(500);
        console.log(await responseText, response.status());
      }

    })


  }



})



let token1;

// Login API
test('Login and generating Token with Invalid username and password',async ({request})=>{
  const response=await request.post("https://restful-booker.herokuapp.com/auth",{

                  headers:{
                    "Content-Type":"application/json"

                  },
                  data:{
                    "username":"admin1",
                    "password":"password1234"
                  }
  });

  
  const responseJson=await response.json();
  console.log(await responseJson,response.status());
  expect(responseJson.reason).toBe("Bad credentials");
  expect(response.status()).toBe(200);

  token1=await responseJson.token;

})
