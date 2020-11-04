import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    BaseEntity,
    Index,
} from "typeorm"
import { Tower } from "./Tower"
import { AbilityLevel } from "./AbilityLevel"

@Entity()
export class Ability extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Index("UNIQUE_INDEX_ability__name", { unique: true })
    @Column()
    name: string

    @Column()
    description: string

    @OneToMany(_type => AbilityLevel, abilityLevel => abilityLevel.ability, {
        cascade: true,
    })
    levels: AbilityLevel[]

    // Tower is unique
    @ManyToOne(_type => Tower, tower => tower.abilities, {
        onDelete: "CASCADE",
        nullable: false,
    })
    @JoinColumn()
    tower: Tower
}
