
export class AutomationLabs{
    constructor(page){
        this.page=page;
        this.firstName=page.getByPlaceholder("Enter your first name");
        this.MiddleName=page.getByPlaceholder("Enter your middle name");
        this.LastName=page.getByPlaceholder("Enter your last name");
        this.Email=page.getByPlaceholder("Enter your email address");
        this.Password=page.getByPlaceholder("Enter your password (min 6 characters)");
        this.Address=page.getByPlaceholder("Enter your address");
        this.city=page.getByPlaceholder("Enter your city");
        this.state=page.getByPlaceholder("Enter your state");
        this.PinCode=page.getByPlaceholder("Enter your pin code");
        this.submit=page.getByText('Submit',{exact:true});


    }

    async fillTheForm(firstname,MiddleName,lastname,Email,password,address,city,state,pinCode){
        await this.page.goto("https://testing.qaautomationlabs.com/form.php?");
        await this.firstName.fill(firstname);
        await this.MiddleName.fill(MiddleName);
        await this.LastName.fill(lastname);
        await this.Email.fill(Email);
        await this.Password.fill(password);
        await this.Address.fill(address);
        await this.city.fill(city);
        await this.state.fill(state);
        await this.PinCode.fill(pinCode);
        await this.submit.click();

        
    }
}