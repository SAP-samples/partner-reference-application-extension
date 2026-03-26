const cds = require('@sap/cds')
const { expect } = require('chai');
require('dotenv').config();
const axios = require('axios');
const catererManagerServiceTestData = require('./testdata/catererManagerServiceTestData.json');

const PRA_API_ENDPOINT = process.env.PRA_SB_API_ENDPOINT
const PRA_AUTH_ENDPOINT = process.env.PRA_SB_AUTH_ENDPOINT
const PRA_CLIENT_ID = process.env.PRA_SB_CLIENT_ID
const PRA_CLIENT_SECRET = process.env.PRA_SB_CLIENT_SECRET
let BEARER_TOKEN;

async function getBearerToken() {
    if (BEARER_TOKEN) {
        return BEARER_TOKEN;
    }
    const auth = Buffer.from(`${PRA_CLIENT_ID}:${PRA_CLIENT_SECRET}`).toString('base64');
    const response = await axios.get(`${PRA_AUTH_ENDPOINT}/oauth/token`, {
        headers: {
            Authorization: `Basic ${auth}`
        },
        params: {
            grant_type: 'client_credentials',
            response_type: 'token'
        }
    });
    return response.data.access_token;
}

describe("Scenario - Check extensions exists", () => {
    let bearerToken;

    beforeAll(async () => {
        bearerToken = await getBearerToken();
    });

    it("Check if extension entity x_Caterers exists", async () => {
        const response = await axios.get(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/x_Caterers`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(response.status).to.equal(200);
    });

});

describe("Scenario - Create a new Poetry Slam event with Caterer", () => {
    let poetrySlamWithCaterer;
    let bearerToken;

    beforeAll(async () => {
        bearerToken = await getBearerToken();

        poetrySlamWithCaterer = catererManagerServiceTestData.createPoetrySlamWithCaterer;
        poetrySlamWithCaterer.ID = cds.utils.uuid();

        const response = await axios.get(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/x_Caterers`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(response.status).to.equal(200);
        poetrySlamWithCaterer.x_caterer_ID = response.data.value[0].ID;
    });

    it("Create a new Poetry Slam event", async () => {
        //Create Poetry Slam draft
        const responsePost = await axios.post(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams`, poetrySlamWithCaterer,
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
                }
            });
        expect(responsePost.status).to.equal(201);
        //Draft Prepare
        let dataDraftPrepare = { SideEffectsQualifier: "" }
        const responseDraftPrepare = await axios.post(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamWithCaterer.ID},IsActiveEntity=false)/PoetrySlamService.draftPrepare`, dataDraftPrepare, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",

            }
        });
        expect(responseDraftPrepare.status).to.equal(200);

        //Draft Activate
        const responseDraftActivate = await axios.post(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamWithCaterer.ID},IsActiveEntity=false)/PoetrySlamService.draftActivate`, {}, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json"
            }
        });
        expect(responseDraftActivate.status).to.equal(201);

        //Get the created Poetry Slam event
        const responseGet = await axios.get(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamWithCaterer.ID},IsActiveEntity=true)`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(responseGet.status).to.equal(200);
        expect(responseGet.data.x_caterer_ID).to.equal(poetrySlamWithCaterer.x_caterer_ID);
    });

    it("Check if extension navigation to x_Caterers exists in PoetrySlams", async () => {
        const response = await axios.get(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamWithCaterer.ID},IsActiveEntity=true)`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        const firstObject = response.data
        expect(firstObject).to.have.property('x_caterer_ID');
    });

    it('Delete the created Poetry Slam event', async () => {
        const response = await axios.delete(`${PRA_API_ENDPOINT}/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamWithCaterer.ID},IsActiveEntity=true)`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(response.status).to.equal(204);
    });
});
