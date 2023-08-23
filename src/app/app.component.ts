import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

type ResourceSource = {
  resource: Resource;
  source: string;
  amount: number;
};

type ResourceSourceWithAmount = {
  source: ResourceSource;
  amount: number;
};

type ResourceCost = {
  resource: Resource;
  cost: number;
};

enum Resource {
  Glimmer,
  LegendaryShards,
  EnhancementCore,
  EnhancementPrisms,
  AscendantShards,
  ExoticShards,
}

export class Configuration {
  constructor(public startLevel: number, public endLevel: number) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'D2CraftingCost';
  model = new Configuration(1, 20);
  readonly Sources : ResourceSource[] = [
    { resource: Resource.Glimmer, source: "Public Event", amount: 10_000 },
    { resource: Resource.Glimmer, source: "Public Event (heroic)", amount: 15_000 },
    { resource: Resource.Glimmer, source: "Rainmaker", amount: 5_000 },
    { resource: Resource.EnhancementCore, source: "Banshee Bounty", amount: 1 },
  ]
  
  readonly Names : Map<Resource, string> = new Map<Resource, string>([
    [Resource.Glimmer, "Glimmer"],
    [Resource.EnhancementCore, "Enhancement Core"],
  ]);
  
  readonly Icons : Map<Resource, string> = new Map<Resource, string>([
    [Resource.Glimmer, "assets/resource_icons/glimmer.png"],
    [Resource.EnhancementCore, "assets/resource_icons/enhancement_core.jpg"],
  ]);


  constructor(private changeDetector: ChangeDetectorRef) {}

  getCostSteps(from: number, to: number): ResourceCost[][] {
    let cost = [];
    for (let i = from; i <= to; i++) {
      cost.push(this.getLevelCost(i));
    }
    return cost;
  }

  computeCost(from: number, to: number): ResourceCost[] {
    let cost = this.getCostSteps(from, to);

    // sum up the cost
    let totalCost: ResourceCost[] = [];
    cost.forEach((levelCost) => {
      levelCost.forEach((resourceCost: ResourceCost) => {
        let found = totalCost.find((x) => x.resource == resourceCost.resource);
        if (found) {
          found.cost += resourceCost.cost;
        } else {
          totalCost.push(resourceCost);
        }
      });
    });

    return totalCost;
  }


  getLevelCost(targetLevel: number): ResourceCost[] {
    if (targetLevel <= 10)
      return [
        { resource: Resource.Glimmer, cost: 3000 },
        { resource: Resource.EnhancementCore, cost: 2 },
      ];
    else if (targetLevel <= 15)
      return [
        { resource: Resource.Glimmer, cost: 5000 },
        { resource: Resource.EnhancementCore, cost: 3 },
      ];
    else if (targetLevel <= 20)
      return [
        { resource: Resource.Glimmer, cost: 7500 },
        { resource: Resource.EnhancementCore, cost: 4 },
      ];
    else if (targetLevel > 20)
      return [
        { resource: Resource.Glimmer, cost: 15000 },
        { resource: Resource.EnhancementCore, cost: 5 },
      ];
    else return [];
  }

  getSources(resource: Resource, targetValue: number ): ResourceSourceWithAmount[] {
    let sources = this.Sources.filter((x) => x.resource == resource);
    let result: ResourceSourceWithAmount[] = [];
    sources.forEach((source) => {
      let amount = Math.ceil(targetValue / source.amount);
      result.push({ source: source, amount: amount });
    });
    return result;
  }

}
