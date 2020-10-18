import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Tower } from "./Tower"

@Entity()
export class AttackStats {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "real" })
    fireInterval: number

    @Column({ type: "real" })
    range: number

    @OneToOne(_ => Tower, tower => tower.attackStats, { onDelete: "CASCADE" })
    @JoinColumn()
    tower: Tower
}
