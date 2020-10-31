import { gql } from "apollo-server"

export const description = "Be able to get ability data by its id"
export const testQuery = gql`
    {
        abilityById(id: 85) {
            abilityDescription
            abilityId
            abilityName
            kingdom
            levelCosts
            numberOfLevels
            totalAbilityCost
            totalCostWithTowers
            towerId
            towerImageUrl
            towerName
            towerType
        }
    }
`

export const result = () => {
    return `
    Object {
      "data": Object {
        "abilityById": Object {
          "abilityDescription": "Fills a zone with powerful healing roots. Allies over it heal over 4 seconds. Each upgrade level increases HP healed",
          "abilityId": 85,
          "abilityName": "Healing Roots",
          "kingdom": "KRV",
          "levelCosts": Array [
            130,
            130,
            130,
          ],
          "numberOfLevels": 3,
          "totalAbilityCost": 390,
          "totalCostWithTowers": 1290,
          "towerId": 104,
          "towerImageUrl": "https://storage.googleapis.com/kingdom-rush-towers.appspot.com/krv-shaman4.png",
          "towerName": "orc shaman, 4",
          "towerType": "MAGE",
        },
      },
      "errors": undefined,
      "extensions": undefined,
      "http": Object {
        "headers": Headers {
          Symbol(map): Object {},
        },
      },
    }
`
}
