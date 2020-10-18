import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql"
import { Tower } from "../models/Tower"
import { TowerType, TowerKingdom, TowerLevel } from "../enums/TowerEnums"

@InputType()
export class CreateTowerInput {
    @Field()
    name: string

    @Field()
    notes: string

    @Field(_ => TowerType)
    towerType: TowerType

    @Field(_ => TowerLevel)
    level: TowerLevel

    @Field(_ => TowerKingdom)
    kingdom: TowerKingdom
}

@Resolver()
export class TowerResolver {
    @Query(() => String)
    hello() {
        return "world"
    }

    @Query(() => [Tower])
    towers() {
        return Tower.find()
    }

    @Mutation(() => Tower)
    async createTower(@Arg("data") data: CreateTowerInput) {
        const tower = Tower.create(data)
        await tower.save()
        return tower
    }
}
