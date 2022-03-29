import { Button } from "../src/Robi/RobiUI"
import { SendEmail } from "../src/Robi/Robi"

const sendEmailButton = Button({
    async action(event) {
        await SendEmail({
            From: 'stephen.a.matheis.ctr@mail.mil',
            To: 'stephen.a.matheis.ctr@mail.mil',
            CC: [
                'stephen.a.matheis.ctr@mail.mil'
            ],
            Subject: `Test Subject`,
            Body: /*html*/ `
                <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
                    <p>
                        Test body. <strong>Bold</strong>. <em>Emphasized</em>.
                    </p>
                    <p>
                        <a href='https://google.com'>Google</a>
                    </p>
                </div>
            `
        });
    },
    parent: planContainer,
    classes: ['mt-5'],
    type: 'outline-success',
    value: 'Send Email',
    margin: '0px 0px 0px 20px'
});

sendEmailButton.add();