import { Field, ArgsType } from "type-graphql"
import { BaseTowerArgs } from "./args"
import { TowerType, AbilitySortColumn, SortOrder } from "./enums"
import { AbilitySortDefinitionElement } from "./inputs"

@ArgsType()
export class AbilityArgs extends BaseTowerArgs {
    @Field(_type => [TowerType], {
        defaultValue: [
            TowerType.BARRACKS,
            TowerType.ARCHER,
            TowerType.ARTILLERY,
            TowerType.MAGE,
        ],
    })
    onlyTowerTypes: [TowerType]

    @Field(_type => [AbilitySortDefinitionElement], {
        defaultValue: [
            { column: AbilitySortColumn.towerName, sortOrder: SortOrder.ASCEND },
            { column: AbilitySortColumn.abilityName, sortOrder: SortOrder.ASCEND },
        ],
    })
    sortDefinition: [AbilitySortDefinitionElement]
}
