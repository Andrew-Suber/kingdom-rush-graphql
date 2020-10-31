import { createConnection, getConnection } from "typeorm"
import { gql } from "apollo-server"
import ascendingTowerIds from "./__snapshots__/ASCENDING_TOWER_IDS"
import attackTowersTypes from "./__snapshots__/ATTACK_TOWER_TYPES"
import attackTowersFireIntervalDescending from "./__snapshots__/ATTACK_TOWER_FIRE_INTERVAL_DESCEND"
import barracksTowers from "./__snapshots__/BARRACKS_TOWERS"
import { executeTest } from "./utils"

beforeAll(async () => {
    await createConnection("test")
})

afterAll(async () => {
    await getConnection("test").close()
})

test("1. Be able to get towers, ids would be sorted in ascending order by default", async () => {
    const testQuery = gql`
        {
            towers {
                id
            }
        }
    `

    await executeTest(testQuery, ascendingTowerIds())
})

test("2. Be able to get attack towers, by default result will be sorted by id in ascending order", async () => {
    const testQuery = gql`
        {
            attackTowers {
                towerType
            }
        }
    `
    await executeTest(testQuery, attackTowersTypes())
})

test("3. Be able to get attack towers sorted by fire interval in descending order", async () => {
    const testQuery = gql`
        {
            attackTowers(
                sortDefinition: [
                    { column: fireInterval, sortOrder: DESCEND }
                    { column: towerType, sortOrder: ASCEND }
                ]
            ) {
                fireInterval
                towerType
            }
        }
    `
    await executeTest(testQuery, attackTowersFireIntervalDescending())
})

test("4. Be able to get barracks towers in correct order", async () => {
    const testQuery = gql`
        {
            barracksTowers(
                sortDefinition: [
                    { column: numberOfUnits, sortOrder: ASCEND }
                    { column: kingdom, sortOrder: DESCEND }
                    { column: name, sortOrder: DESCEND }
                ]
            ) {
                name
                kingdom
                numberOfUnits
            }
        }
    `
    await executeTest(testQuery, barracksTowers())
})
