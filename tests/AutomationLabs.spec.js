import {test,expect, devices} from '@playwright/test';
import StateSpecifiJsonData from '../PageObjects/StateSpecifiJsonData.json'with {type:'json'};
import { AutomationLabs } from '../PageObjects/AutomationLabs.js';

// test.use({...devices['iPhone 13 Pro Max'],
//     isMobile:true,
//     hasTouch:true
// })


test.describe('Data Driven testing using JSON State specfic data',async ()=>{

    const date=new Date().toISOString().replace(/:/g,'-').replace(/\./g,'-');

    
    for(const state in StateSpecifiJsonData){
        
        test(`Form completed for - ${state} state`, async ({page})=>{

            const automation=new AutomationLabs(page); 
            
            const firstName=StateSpecifiJsonData[state].firstName;
            const MiddleName=StateSpecifiJsonData[state].middleName;
            const LastName=StateSpecifiJsonData[state].lastName;
            const Email=StateSpecifiJsonData[state].email;
            const password=StateSpecifiJsonData[state].password;
            const address=StateSpecifiJsonData[state].address;
            const city=StateSpecifiJsonData[state].city
            const state1=StateSpecifiJsonData[state].state;
            const pinCode=StateSpecifiJsonData[state].pinCode
           
        
            await automation.fillTheForm(firstName,MiddleName,LastName,Email,password,address,city,state1,pinCode);

            await page.screenshot({path:`${process.cwd()}/screenshots/${state}/${date}.png`})
    } )
    }


})