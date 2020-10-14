import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { TowerType, TowerCategory, TowerKingdom, TowerLevel } from "../enums/TowerEnums"
import { ObjectType, Field, ID } from "type-graphql"

@ObjectType()
@Entity({ name: "Towers" })
export class Tower extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => String)
    @Column({ unique: true })
    name: string

    @Field(() => String)
    @Column()
    notes: string

    @Field(_ => TowerType)
    @Column({
        type: "enum",
        enum: TowerType,
    })
    towerType: TowerType

    @Field(_ => TowerLevel)
    @Column({
        type: "enum",
        enum: TowerLevel,
    })
    level: TowerLevel

    @Field(_ => TowerKingdom)
    @Column({
        type: "enum",
        enum: TowerKingdom,
    })
    kingdom: TowerKingdom

    @Field(_ => TowerCategory)
    @Column({
        type: "enum",
        enum: TowerCategory,
        default: "basic",
    })
    towerCategory: TowerCategory
}
