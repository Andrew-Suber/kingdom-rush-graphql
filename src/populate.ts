import { getRepository } from "typeorm"
import { Tower } from "./models/Tower"
import { MainStats } from "./models/MainStats"

import { TowerType, TowerLevel, TowerKingdom } from "./enums/TowerEnums"

const path: any = require("path")
const pathToTowerJson = path.join(__dirname, "../data/generated", "towers.json")
const towerJson: any = require(pathToTowerJson)

type towerData = {
    name: string
    kingdom:
        | "kingdom rush: vengeance"
        | "kingdom rush: origin"
        | "kingdom rush"
        | "kingdom rush: frontiers"
    level: 1 | 2 | 3 | 4
    towerType: "magic" | "artillery" | "ranged" | "barracks"
    buildCost: number
    damage: {
        minimum: number
        maximum: number
    }
}

const mapStringToKingdom = {
    "kingdom rush: vengeance": TowerKingdom.KRV,
    "kingdom rush: origin": TowerKingdom.KRO,
    "kingdom rush: frontiers": TowerKingdom.KRF,
    "kingdom rush": TowerKingdom.KR,
}

const mapIntToLevel = {
    1: TowerLevel.LVL1,
    2: TowerLevel.LVL2,
    3: TowerLevel.LVL3,
    4: TowerLevel.LVL4,
}

const mapStringToTowerType = {
    barracks: TowerType.BARRACKS,
    magic: TowerType.MAGE,
    ranged: TowerType.ARCHER,
    artillery: TowerType.ARTILLERY,
}

function logError(error: any) {
    if ("name" in error && "message" in error && "detail" in error) {
        console.log("ERROR START")
        console.log("ErrorName:", error.name)
        console.log("ErrorMessage:", error.message)
        console.log("ErrorDetails:", error.detail)
        console.log("ERROR END")
    }
}

const populateMainStats = async () => {
    const towers: [towerData] = (<any>towerJson).towers
    for (let tower of towers) {
        console.log(tower.name, tower.kingdom)
        let retrievedTower = await getRepository(Tower).findOne({
            where: {
                name: tower.name,
                kingdom: tower.kingdom,
            },
            relations: ["mainStats"],
        })

        if (retrievedTower !== undefined && "id" in retrievedTower) {
            if (retrievedTower.mainStats.id === undefined) {
                console.log("Retrieved Tower:", retrievedTower, tower)
                const mainStats = new MainStats()
                mainStats.buildCost = tower.buildCost
                mainStats.damageMinimum = tower.damage.minimum
                mainStats.damageMaximum = tower.damage.maximum

                try {
                    console.log("saving retrieved tower with main stats...")
                    retrievedTower.mainStats = mainStats
                    await getRepository(Tower).save(retrievedTower)
                } catch (error) {
                    logError(error)
                }
            } else {
                console.log(
                    "This tower already has a main stats",
                    retrievedTower.name,
                    retrievedTower.mainStats
                )
            }
        }
    }
}
const populateTowers = async () => {
    const towers: [towerData] = (<any>towerJson).towers
    for (let tower of towers) {
        console.log("Tower to insert:", tower)
        const newTower = {
            name: tower.name,
            towerType: mapStringToTowerType[tower.towerType],
            level: mapIntToLevel[tower.level],
            kingdom: mapStringToKingdom[tower.kingdom],
        }

        try {
            await getRepository(Tower).insert(newTower)
        } catch (error) {
            logError(error)
        }
    }
}

export { populateTowers, populateMainStats }
