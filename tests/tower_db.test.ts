import { createConnection, getConnection, getRepository } from "typeorm"
import { Tower, MainStats, Ability, AbilityLevel } from "../src/models/"
import { TowerType, TowerLevel, TowerKingdom } from "../src/definitions/enums"

const DB_NAME = "empty_test"

const getExampleTower = (): Tower => {
    let tower = new Tower()
    tower.name = "dwarven bombard"
    tower.kingdom = TowerKingdom.KR
    tower.towerType = TowerType.ARTILLERY
    tower.level = TowerLevel.LVL1
    return tower
}

const getExampleMainStats = (): MainStats => {
    let mainStats = new MainStats()
    mainStats.buildCost = 125
    mainStats.damageMinimum = 8
    mainStats.damageMaximum = 15
    return mainStats
}

const EXAMPLE_TOWER_DATA = {
    name: "Militia Barracks",
    towerType: TowerType.BARRACKS,
    level: TowerLevel.LVL1,
    kingdom: TowerKingdom.KR,
}

beforeAll(async () => {
    await createConnection("empty_test")
})

afterAll(async () => {
    await getConnection("empty_test").close()
})

const expectCount = async (entity: Function, expectedCount: number) => {
    const actualCount = await getRepository(entity, DB_NAME).count()
    expect(actualCount).toBe(expectedCount)
}

const getTowerRepo = () => getRepository(Tower, DB_NAME)

test("1. Be able to store, fetch, and remove a tower", async () => {
    /********************
     * Our example tower shouldn't exist yet in our empty test database
     ********************/
    let retrievedTowers = await getTowerRepo().find({
        where: {
            name: EXAMPLE_TOWER_DATA.name,
        },
    })

    expect(retrievedTowers.length).toBe(0)

    /********************
     * We shoud ne able to successfully insert the tower,
     * increasing entry count of table by one
     ********************/
    await getTowerRepo().insert(EXAMPLE_TOWER_DATA)
    await expectCount(Tower, 1)

    /********************
     * We should able to find our inserted tower by name
     ********************/
    retrievedTowers = await getTowerRepo().find({
        where: {
            name: EXAMPLE_TOWER_DATA.name,
        },
    })

    expect(retrievedTowers.length).toBe(1)

    const retrievedTower = retrievedTowers[0]
    expect(retrievedTower.name).toBe(EXAMPLE_TOWER_DATA.name)

    /********************
     * We should be able to remove the tower we inserted
     ********************/
    await getTowerRepo().remove(retrievedTower)
    await expectCount(Tower, 0)
})

test("2. Store a tower and add main stats deleting the tower would also delete main stats", async () => {
    let tower = getExampleTower()
    let mainStats = getExampleMainStats()
    tower.mainStats = mainStats

    /********************
     * Our example tower shouldn't exist in our empty database yet
     * It is currently just in memory
     ********************/
    let retrievedTowers = await getTowerRepo().find({
        where: {
            name: tower.name,
        },
    })

    expect(retrievedTowers.length).toBe(0)

    /********************
     * Saving our tower should also save its main stats
     ********************/
    await getTowerRepo().save(tower)
    await expectCount(Tower, 1)
    await expectCount(MainStats, 1)

    /********************
     * Querying the tower should also load its main stats
     * With the expected column entries
     ********************/
    retrievedTowers = await getTowerRepo().find({
        where: {
            name: tower.name,
        },
        relations: ["mainStats"],
    })

    expect(retrievedTowers.length).toBe(1)

    const retrievedTower = retrievedTowers[0]
    expect(retrievedTower.name).toBe(tower.name)
    expect(retrievedTower.mainStats.buildCost).toBe(tower.mainStats.buildCost)

    /********************
     * Removing the tower should also remove its mainstats
     ********************/
    await getTowerRepo().remove(retrievedTower)
    await expectCount(Tower, 0)
    await expectCount(MainStats, 0)
})

test("3. Be able to store abilities and ability levels of a tower, deleting tower would remove ability and ability levels", async () => {
    const ABILITY_REPO = getRepository(Ability, DB_NAME)

    /********************
     * We should start with an empty database
     ********************/
    await expectCount(Tower, 0)
    await expectCount(Ability, 0)
    await expectCount(AbilityLevel, 0)

    /********************
     * Saving a tower should also save its
     * ability and ability levels
     ********************/
    let tower = getExampleTower()

    let ability1 = new Ability()
    ability1.name = "poison arrows"
    ability1.description = "Poisons enemies"

    let ability1level1 = new AbilityLevel()
    ability1level1.level = 1
    ability1level1.cost = 250
    ability1.levels = [ability1level1]

    let ability2 = new Ability()
    ability2.name = "poison arrow2s"
    ability2.description = "Poisons enemies2"

    let ability2level1 = new AbilityLevel()
    ability2level1.level = 1
    ability2level1.cost = 175

    let ability2level2 = new AbilityLevel()
    ability2level2.level = 2
    ability2level2.cost = 200
    ability2.levels = [ability2level1, ability2level2]

    tower.abilities = [ability1, ability2]

    await getTowerRepo().save(tower)

    await expectCount(Tower, 1)
    await expectCount(Ability, 2)
    await expectCount(AbilityLevel, 3)

    /********************
     * Querying the tower should also load its main stats
     ********************/
    let retrievedTowers = await getTowerRepo().find({
        where: {
            name: tower.name,
        },
        relations: ["abilities"],
    })

    expect(retrievedTowers.length).toBe(1)

    /********************
     * Querying an ability should also load its levels
     ********************/
    let retrievedTower = retrievedTowers[0]
    let abilities = await ABILITY_REPO.find({
        where: {
            name: retrievedTower.abilities[0].name,
        },
        relations: ["levels"],
    })

    expect(retrievedTower.name).toBe(tower.name)
    expect(retrievedTower.abilities[0].name).toBe(ability1.name)
    expect(abilities[0].levels[0].cost).toBe(250)

    /********************
     * Removing a tower should also remove its ability and ability levels
     ********************/
    await getTowerRepo().remove(retrievedTower)
    await expectCount(Tower, 0)
    await expectCount(Ability, 0)
    await expectCount(AbilityLevel, 0)
})
