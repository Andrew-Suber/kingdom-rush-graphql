/*
Towers(
    skip: 5,
    take: 10,
    onlyLevels: [1, 2, 3],
    onlyTypes: [MAGE]
    onlyKingdoms: [KR, KRV],
    sortBy: [
        {column: "fireInterval", order: "ASCENDING"},
        {column: "range", order: "ASCENDING"},
        {column: "name", order: "ASCENDING"},
        {column: "kingdom", order: "ASCENDING"},
        {column: "towerType", order: "ASCENDING"},
        {column: "towerLevel", order: "ASCENDING"},
        {column: "id", order: "ASCENDING"},
        {column: "buildCost", order: "ASCENDING"},
        {column: "damageMinimum", order: "ASCENDING"},
        {column: "damageMaximum", order: "ASCENDING"},
        {column: "fireRate", order: "ASCENDING"},
        {column: "range", order: "ASCENDING"},
    ]
)
 */
import { Resolver, Query, Args } from "type-graphql"
import { AttackTower, AttackTowerArgs, createFilter, sortExpression } from "./shared"
import { getRepository } from "typeorm"
import { Tower } from "../models/Tower"

@Resolver()
export class AttackTowerResolver {
    @Query(() => [AttackTower])
    async attackTowers(
        @Args()
        {
            skip,
            take,
            onlyLevels,
            onlyKingdoms,
            onlyTowerTypes,
            sortDefinition,
        }: AttackTowerArgs
    ) {
        const hasNoElement =
            onlyLevels.length <= 0 ||
            onlyKingdoms.length <= 0 ||
            onlyTowerTypes.length <= 0

        if (hasNoElement) {
            return []
        }

        const tableExpr = `SELECT * FROM "Towers" INNER JOIN main_stats ON "Towers".id = main_stats."towerId" INNER JOIN attack_stats ON main_stats."towerId" = attack_stats."towerId"`
        const levels = createFilter(onlyLevels, `level`)
        const kingdoms = createFilter(onlyKingdoms, `kingdom`)
        const towerTypes = createFilter(onlyTowerTypes, `"towerType"`)
        // TODO: Add check to make sure all elements of the array sortDefinition have unique columns
        const sortColumns = sortExpression(sortDefinition)

        const filterExpr = `WHERE (${levels}) AND (${kingdoms}) AND (${towerTypes})`
        const sortExpr = `ORDER BY ${sortColumns}`
        const pageExpr = `LIMIT ${take} OFFSET ${skip}`
        const queryExpression = `${tableExpr} ${filterExpr} ${sortExpr} ${pageExpr}`

        console.log(queryExpression)

        const dbName = process.env.NODE_ENV === "test" ? "test" : "default"
        const result: AttackTower[] = await getRepository(Tower, dbName).query(
            queryExpression
        )

        const cleanResult = result.map(tower => ({
            ...tower,
            level: Number(tower["level"]),
        }))
        return cleanResult
    }
}
