import { registerEnumType } from "type-graphql"

export enum TowerType {
    ARCHER = "archer",
    BARRACKS = "barracks",
    MAGE = "mage",
    ARTILLERY = "artillery",
}

export enum AttackTowerType {
    ARCHER = "archer",
    MAGE = "mage",
    ARTILLERY = "artillery",
}

export enum TowerLevel {
    LVL1 = 1,
    LVL2 = 2,
    LVL3 = 3,
    LVL4 = 4,
}

export enum TowerKingdom {
    KR = "kingdom rush",
    KRF = "kingdom rush: frontiers",
    KRO = "kingdom rush: origins",
    KRV = "kingdom rush: vengeance",
}

export enum SortOrder {
    ASCEND = "ASC",
    DESCEND = "DESC",
}

export enum TowerColumn {
    name = `"Towers".name`,
    kingdom = `kingdom`,
    towerType = `"towerType"`,
    level = `level`,
    id = `"Towers".id`,
    buildCost = `"buildCost"`,
    damageMinimum = `"damageMinimum"`,
    damageMaximum = `"damageMaximum"`,
}

export enum AttackTowerColumn {
    name = `"Towers".name`,
    kingdom = `kingdom`,
    towerType = `"towerType"`,
    level = `level`,
    id = `"Towers".id`,
    buildCost = `"buildCost"`,
    damageMinimum = `"damageMinimum"`,
    damageMaximum = `"damageMaximum"`,
    fireInterval = `"fireInterval"`,
    range = `range`,
}

registerEnumType(SortOrder, { name: "SortOrder" })
registerEnumType(TowerColumn, { name: "TowerColumn" })
registerEnumType(AttackTowerColumn, { name: "AttackTowerColumn" })
registerEnumType(TowerType, { name: "TowerType" })
registerEnumType(AttackTowerType, { name: "AttackTowerType" })
registerEnumType(TowerLevel, { name: "TowerLevel" })
registerEnumType(TowerKingdom, { name: "TowerKingdom" })
