import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tree, ForestStats } from '@/types/productivity';

const TREES_STORAGE_KEY = '@learnsmart_virtual_forest';
const ACTIVE_TREE_KEY = '@learnsmart_active_tree';

interface ActiveTreeState {
  treeId: string;
  sessionId: string;
  growth: number;
  alive: boolean;
  plantedAt: string;
  lastFocusCheck: number;
}

class FocusTracker {
  private appState: AppStateStatus = 'active';
  private activeTree: ActiveTreeState | null = null;
  private focusCheckInterval: NodeJS.Timeout | null = null;
  private growthInterval: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;

  // Tree management
  async startGrowingTree(sessionId: string, _treeType: Tree['type'] = 'oak'): Promise<string> {
    const treeId = `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.activeTree = {
      treeId,
      sessionId,
      growth: 0,
      alive: true,
      plantedAt: new Date().toISOString(),
      lastFocusCheck: Date.now(),
    };

    await this.saveActiveTree(this.activeTree);
    this.startTracking();
    
    return treeId;
  }

  async stopGrowingTree(): Promise<void> {
    this.stopTracking();
    
    if (this.activeTree && this.activeTree.alive) {
      // Save the completed tree
      const tree: Tree = {
        id: this.activeTree.treeId,
        type: await this.getRandomTreeType(),
        growth: this.activeTree.growth,
        alive: true,
        plantedAt: this.activeTree.plantedAt,
        sessionId: this.activeTree.sessionId,
      };
      await this.saveTree(tree);
    }
    
    this.activeTree = null;
    await AsyncStorage.removeItem(ACTIVE_TREE_KEY);
  }

  private async killTree(): Promise<void> {
    if (!this.activeTree) return;

    this.activeTree.alive = false;
    await this.saveActiveTree(this.activeTree);
    
    // Save dead tree record (optional - you might not want to show dead trees)
    const tree: Tree = {
      id: this.activeTree.treeId,
      type: await this.getRandomTreeType(),
      growth: this.activeTree.growth,
      alive: false,
      plantedAt: this.activeTree.plantedAt,
      sessionId: this.activeTree.sessionId,
    };
    await this.saveTree(tree);
  }

  async restartTree(sessionId: string): Promise<string> {
    // Save current tree as dead if it was alive
    if (this.activeTree) {
      await this.killTree();
    }
    
    // Start a new tree
    return this.startGrowingTree(sessionId);
  }

  private async saveTree(tree: Tree): Promise<void> {
    try {
      const trees = await this.getAllTrees();
      trees.push(tree);
      await AsyncStorage.setItem(TREES_STORAGE_KEY, JSON.stringify(trees));
    } catch (error) {
                  // Error handled silently
    }
  }

  async getAllTrees(): Promise<Tree[]> {
    try {
      const data = await AsyncStorage.getItem(TREES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
                  // Error handled silently
      return [];
    }
  }

  async getAliveTrees(): Promise<Tree[]> {
    const trees = await this.getAllTrees();
    return trees.filter((tree) => tree.alive);
  }

  async getTreesBySession(sessionId: string): Promise<Tree[]> {
    const trees = await this.getAllTrees();
    return trees.filter((tree) => tree.sessionId === sessionId);
  }

  // Focus tracking
  private startTracking(): void {
    // Track app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    
    // Check focus periodically
    this.focusCheckInterval = setInterval(() => {
      this.checkFocus();
    }, 1000); // Check every second
    
    // Update tree growth periodically
    this.growthInterval = setInterval(() => {
      this.updateGrowth();
    }, 500); // Update growth every 500ms
  }

  private stopTracking(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    
    if (this.focusCheckInterval) {
      clearInterval(this.focusCheckInterval);
      this.focusCheckInterval = null;
    }
    
    if (this.growthInterval) {
      clearInterval(this.growthInterval);
      this.growthInterval = null;
    }
  }

  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    const previousState = this.appState;
    this.appState = nextAppState;
    
    // If app goes to background or inactive, kill the tree
    if ((nextAppState === 'background' || nextAppState === 'inactive') && 
        previousState === 'active' && 
        this.activeTree?.alive) {
      this.killTree();
    }
  };

  private checkFocus(): void {
    if (!this.activeTree) return;
    
    // Additional focus check logic could go here
    // For example, checking if the user is actually interacting with the app
    this.activeTree.lastFocusCheck = Date.now();
    this.saveActiveTree(this.activeTree);
  }

  private updateGrowth(): void {
    if (!this.activeTree || !this.activeTree.alive) return;
    
    // Only grow if app is active
    if (this.appState === 'active') {
      // Growth rate: 100% over 25 minutes (1500 seconds)
      // That's 0.067% per second per 500ms interval = 0.033%
      this.activeTree.growth = Math.min(100, this.activeTree.growth + 0.05);
      this.saveActiveTree(this.activeTree);
    }
  }

  // Active tree management
  private async saveActiveTree(tree: ActiveTreeState): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_TREE_KEY, JSON.stringify(tree));
    } catch (error) {
                  // Error handled silently
    }
  }

  async loadActiveTree(): Promise<ActiveTreeState | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_TREE_KEY);
      if (data) {
        this.activeTree = JSON.parse(data) as ActiveTreeState;
        
        // Check if tree should still be alive
        if (this.activeTree.alive && this.appState === 'active') {
          this.startTracking();
          return this.activeTree;
        } else if (this.activeTree.alive) {
          // App was not active when tree was loaded
          await this.killTree();
        }
      }
    } catch (error) {
                  // Error handled silently
    }
    return null;
  }

  // Stats
  async getForestStats(): Promise<ForestStats> {
    try {
      const trees = await this.getAllTrees();
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const treesThisWeek = trees.filter((tree) => {
        const plantedDate = new Date(tree.plantedAt);
        return tree.alive && plantedDate >= weekAgo;
      }).length;
      
      const treesThisMonth = trees.filter((tree) => {
        const plantedDate = new Date(tree.plantedAt);
        return tree.alive && plantedDate >= monthAgo;
      }).length;
      
      // Forest score: 10 points per tree
      const forestScore = treesThisWeek * 10;
      
      return {
        totalTrees: trees.filter((t) => t.alive).length,
        treesThisWeek,
        treesThisMonth,
        forestScore,
      };
    } catch (error) {
                  // Error handled silently
      return {
        totalTrees: 0,
        treesThisWeek: 0,
        treesThisMonth: 0,
        forestScore: 0,
      };
    }
  }

  async getRecentTrees(limit: number = 10): Promise<Tree[]> {
    try {
      const trees = await this.getAllTrees();
      return trees
        .filter((tree) => tree.alive)
        .sort((a, b) => new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime())
        .slice(0, limit);
    } catch (error) {
                  // Error handled silently
      return [];
    }
  }

  // Tree type utilities
  private async getRandomTreeType(): Promise<Tree['type']> {
    const types: Tree['type'][] = ['oak', 'pine', 'cherry', 'willow', 'maple'];
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
  }

  getTreeEmoji(treeType: Tree['type']): string {
    const emojis: Record<Tree['type'], string> = {
      oak: '🌳',
      pine: '🌲',
      cherry: '🌸',
      willow: '🏞️',
      maple: '🍁',
    };
    return emojis[treeType] || '🌳';
  }

  getTreeName(treeType: Tree['type']): string {
    const names: Record<Tree['type'], string> = {
      oak: 'Oak Tree',
      pine: 'Pine Tree',
      cherry: 'Cherry Blossom',
      willow: 'Willow Tree',
      maple: 'Maple Tree',
    };
    return names[treeType] || 'Tree';
  }

  // Cleanup
  destroy(): void {
    this.stopTracking();
    this.activeTree = null;
  }

  getCurrentGrowth(): number {
    return this.activeTree?.growth ?? 0;
  }

  isTreeAlive(): boolean {
    return this.activeTree?.alive ?? false;
  }
}

export const focusTracker = new FocusTracker();
