// GAME PARAMETERS /////////////////////////////////////////////////////////////

const tile_size = 5; // Tile size [px].

const border_width =
    3; // Width of the filled border in the initial game field [tiles].

const player_speed = 40; // Player movement speed [tiles/second].
const enemy_speed = 40;  // Enemy movement speed [tiles/second].
const enemy_speed_increase_per_level =
    1; // Enemy speed increase for each level [tiles/speed/level].

const fps = 60; // Frames per second [Hz].
const n_sub_frames =
    10; // Sub-frames for updating player and enemies positions.

const next_level_claimed =
    0.75; // Fraction of tiles to be claimed to go to the next level.

const n_initial_enemies = 3;         // Number of enemies in level 1.
const n_enemies_per_level = 1;       // Number of extra enemies every level.
const enemy_deleter_fraction = 0.25; // Fraction of deleter enemies.
const enemy_claimed_fraction = 0.25; // Fraction of enemies in the claimed area.
const enemy_minimum_steepness =
    Math.PI / 12; // Minimum obliqueness of the enemy trajectory, to avoid
                  // enemies parallel to player.

const min_claimed_distance_from_player =
    30; // Minimum spawn distance of a claimed enemy to the player.

const score_normalization_factor = 2000; // Scaling factor for the score.

const delay_before_new_life = 0.5; // Delay before allowing to restart after
                                   // losing one life or clearing the level [s].

// ENUMERATIONS ////////////////////////////////////////////////////////////////

// Game state constants.
const STATE_PLAYING = 0; // Game is running.
const STATE_PAUSE = 1; // Game has been paused by the death of the player or the
                       // clearing of the level.
const STATE_GAMEOVER = 2;     // Game has ended.
const STATE_INGAME_PAUSE = 3; // The game was manually paused.

// Direction constants.
const DIRECTION_IDLE = 0;
const DIRECTION_N = 1;
const DIRECTION_W = 2;
const DIRECTION_S = 3;
const DIRECTION_E = 4;

// Tile status constants.
const TILE_CLAIMED = 0;
const TILE_UNCLAIMED = 1;
const TILE_LINE = 2;

// Enemy types.
const ENEMY_NORMAL = 0; // Normal "red" enemies, bouncing in the unclaimed area.
const ENEMY_DELETER = 1; // Deleter "green" enemy, bouncing in the unclaimed
                         // area and unclaiming the claimed tiles it hits.
const ENEMY_CLAIMED = 2; // Enemy bouncing in the claimed area.

// GRAPHICAL PARAMETERS ////////////////////////////////////////////////////////

const color_claimed = "#FFFFFF";   // Color for claimed regions.
const color_unclaimed = "#000000"; // Color for unclaimed regions.
const color_line = "#808080";      // Color for player line while being drawn.
const color_enemy_normal = "#FF0000";  // Color for normal enemies.
const color_enemy_deleter = "#00FF00"; // Color for deleters.
const color_enemy_claimed = "#0000FF"; // Color for enemies in the claimed area.

// BITMAP FONT /////////////////////////////////////////////////////////////////

const bitfont_alphabet = [
  "|", "%", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " ",
  "a", "c", "e", "g", "h", "i", "l", "m", "o", "r", "s", "t", "v"
];
const bitfont_characters = [
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // |
  [ 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 ], // %
  [ 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // 0
  [ 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 ], // 1
  [ 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1 ], // 2
  [ 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1 ], // 3
  [ 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1 ], // 4
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // 5
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1 ], // 6
  [ 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1 ], // 7
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1 ], // 8
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // 9
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // <space>
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1 ], // a
  [ 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1 ], // c
  [ 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1 ], // e
  [ 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // g
  [ 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1 ], // h
  [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 ], // i
  [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1 ], // l
  [ 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1 ], // m
  [ 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // o
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1 ], // r
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // s
  [ 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 ], // t
  [ 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0 ]  // v
];
const bitfont_kerning = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
  0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0
];

let BitmapFont = function(alphabet, characters, kerning, w, h, pixel_size) {
  this.alphabet = alphabet;     // Font alphabet.
  this.characters = characters; // Font characters.
  this.kerning = kerning;       // Kerning.
  this.w = w;                   // Font width.
  this.h = h;                   // Font height.
  this.pixel_size = pixel_size;

  // Render a single character in given position.
  this.render_character = function(context, x, y, char, color) {
    let alphabet_idx = this.alphabet.indexOf(char);
    if (alphabet_idx < 0)
      return 0;

    let bit_char = this.characters[alphabet_idx];

    context.fillStyle = color;
    for (let row = 0; row < this.h; ++row)
      for (let col = 0; col < this.w; ++col)
        if (bit_char[row * this.w + col])
          context.fillRect(x + col * pixel_size, y + row * pixel_size,
                           pixel_size, pixel_size);

    return this.w - this.kerning[alphabet_idx];
  };

  // Render a string starting from given position.
  this.render_string = function(context, x, y, string, color) {
    let cur_x = x;
    let dx;
    for (let i = 0; i < string.length; ++i) {
      dx = this.render_character(context, cur_x, y, string.charAt(i), color);
      cur_x += (dx + 1) * this.pixel_size;
    }
  };

  // Compute the width of a character without actually rendering it.
  this.char_width = function(char) {
    let alphabet_idx = this.alphabet.indexOf(char);
    if (alphabet_idx < 0)
      return 0;

    else
      return (this.w - this.kerning[alphabet_idx]) * this.pixel_size;
  };

  // Compute the width of a string without actually rendering it.
  this.string_width = function(string) {
    let w = 0;
    for (let i = 0; i < string.length; ++i)
      w += this.char_width(string.charAt(i)) + this.pixel_size;
    w -= this.pixel_size;
    return w;
  };
};

// GAME LOGIC //////////////////////////////////////////////////////////////////

// Game field class.
let Field = function() {
  this.state = STATE_PLAYING; // Game state.
  this.level = 1;             // Current level.

  this.w = 0;     // Game width [tiles].
  this.h = 0;     // Game height [tiles].
  this.tiles = 0; // Game tiles. An array of arrays, first index: row, last
                  // index: column.
  this.tiles_to_claim =
      0; // Helper tile matrix for computing newly claimed tiles.

  this.player_lives = 3;                  // Player lives counter.
  this.player_score = 0;                  // Player score.
  this.player_x = 0;                      // Player x coordinate [tiles].
  this.player_y = 0;                      // Player y coordinate [tiles].
  this.player_direction = DIRECTION_IDLE; // Player direction.

  this.enemies = 0; // Array of enemies. Each entry is in the format [x, y,
                    // speed_x, speed_y, type].

  this.t = 0;          // Elapsed game time [s].
  this.pause_time = 0; // Time when pause was triggered.

  this.claimed = 0; // Currently claimed fraction.

  // Setup method: creates the game field with required dimensions, and sets
  // it up for the game.
  this.setup = function(w, h) {
    this.setup_field(w, h);

    this.state = STATE_PLAYING;
    this.level = 1;

    // Position the player at the top center.
    this.player_x = Math.floor(this.w / 2);
    this.player_y = 0;
    this.player_direction = DIRECTION_IDLE;
    this.player_lives = 3;
    this.player_score = 0;

    // Generate enemies.
    this.setup_enemies(n_initial_enemies);

    // Reset time.
    this.t = 0;
  };

  // Setup field.
  this.setup_field = function(w, h) {
    this.w = w;
    this.h = h;

    this.claimed = 0;

    // Create the game field
    this.tiles = new Array(h);
    this.tiles_to_claim = new Array(h);
    for (let row = 0; row < this.h; ++row) {
      this.tiles[row] = new Array(w);
      this.tiles_to_claim[row] = new Array(w);

      for (let col = 0; col < this.w; ++col) {
        if (row < border_width || row >= this.h - border_width ||
            col < border_width || col >= this.w - border_width) {
          this.tiles[row][col] = TILE_CLAIMED;
          this.claimed++;
        } else
          this.tiles[row][col] = TILE_UNCLAIMED;
      }
    }
  };

  // Setup enemies.
  this.setup_enemies = function(n_enemies) {
    // First remove all existing enemies, if any.
    this.enemies = new Array(n_enemies);

    // Compute amount of enemies of each type.
    let n_deleters = Math.floor(n_enemies * enemy_deleter_fraction);
    let n_claimed = Math.floor(n_enemies * enemy_claimed_fraction);
    let n_normal = n_enemies - n_deleters;

    // Generate the new enemies in random positions and with random speed.
    for (let i = 0; i < n_normal + n_deleters + n_claimed; ++i) {
      let type = i < n_deleters ? ENEMY_DELETER
                                : (i < (n_deleters + n_claimed) ? ENEMY_CLAIMED
                                                                : ENEMY_NORMAL);
      let x, y, theta;

      do {
        x = Math.floor(Math.random() * this.w);
        y = Math.floor(Math.random() * this.h);
      } while ((type == ENEMY_CLAIMED &&
                (this.tiles[y][x] != TILE_CLAIMED ||
                 (x - this.player_x) * (x - this.player_x) +
                         (y - this.player_y) * (y - this.player_y) <
                     min_claimed_distance_from_player *
                         min_claimed_distance_from_player)) ||
               (type != ENEMY_CLAIMED && this.tiles[y][x] != TILE_UNCLAIMED));

      do {
        theta = Math.random() * 2 * Math.PI;
      } while (Math.abs(theta) < enemy_minimum_steepness ||
               Math.abs(theta - Math.PI / 2) < enemy_minimum_steepness ||
               Math.abs(theta - Math.PI) < enemy_minimum_steepness ||
               Math.abs(theta - 3 * Math.PI / 2) < enemy_minimum_steepness ||
               Math.abs(theta - 2 * Math.PI) < enemy_minimum_steepness);
      let speed = enemy_speed + this.level * enemy_speed_increase_per_level;
      this.enemies[i] =
          [ x, y, speed * Math.cos(theta), speed * Math.sin(theta), type ];
    }
  };

  // Update method.
  this.update = function(t) {
    if (this.state == STATE_PLAYING) {
      // Get old tile coordinates.
      let old_tile_x = Math.floor(this.player_x);
      let old_tile_y = Math.floor(this.player_y);

      this.update_player(t);

      // Get new tile coordinates.
      let new_tile_x = Math.floor(this.player_x);
      let new_tile_y = Math.floor(this.player_y);

      // If the player moved from an unclaimed tile, draw the line there.
      if ((old_tile_x != new_tile_x || old_tile_y != new_tile_y) &&
          this.tiles[old_tile_y][old_tile_x] == TILE_UNCLAIMED) {
        this.tiles[old_tile_y][old_tile_x] = TILE_LINE;

        // If the player reached an already claimed area, compute the new
        // claimed area.
        if (this.tiles[new_tile_y][new_tile_x] == TILE_CLAIMED) {
          this.check_new_claimed_area();
          this.player_direction = DIRECTION_IDLE;
          this.player_x = new_tile_x;
          this.player_y = new_tile_y;
        }

        // If the player hit his own line, he dies.
        if (this.tiles[new_tile_y][new_tile_x] == TILE_LINE)
          this.die();
      }

      this.update_enemies(t);

      // Check collisions between enemies and player.
      this.check_collisions();

      this.t += t;
    }
  };

  // Update the player position.
  this.update_player = function(t) {
    // Move the player.
    let dx = t * player_speed;
    if (this.player_direction == DIRECTION_N)
      this.player_y -= dx;
    else if (this.player_direction == DIRECTION_W)
      this.player_x -= dx;
    else if (this.player_direction == DIRECTION_S)
      this.player_y += dx;
    else if (this.player_direction == DIRECTION_E)
      this.player_x += dx;

    // Check that the player is not out of bounds.
    if (this.player_x < 0) {
      this.player_x = 0;
      this.player_direction = DIRECTION_IDLE;
    }
    if (this.player_x >= this.w) {
      this.player_x = this.w - 1;
      this.player_direction = DIRECTION_IDLE;
    }
    if (this.player_y < 0) {
      this.player_y = 0;
      this.player_direction = DIRECTION_IDLE;
    }
    if (this.player_y >= this.h) {
      this.player_y = this.h - 1;
      this.player_direction = DIRECTION_IDLE;
    }
  };

  // Update the enemies' positions.
  this.update_enemies = function(t) {
    for (let i = 0; i < this.enemies.length; ++i) {
      // Obstacle tile type.
      let tile_walkable =
          this.enemies[i][4] == ENEMY_CLAIMED ? TILE_CLAIMED : TILE_UNCLAIMED;
      let tile_obstacle =
          this.enemies[i][4] == ENEMY_CLAIMED ? TILE_UNCLAIMED : TILE_CLAIMED;

      // Move the enemy.
      this.enemies[i][0] += this.enemies[i][2] * t;
      this.enemies[i][1] += this.enemies[i][3] * t;

      // Compute tile coordinates.
      let tile_x = Math.floor(this.enemies[i][0]);
      let tile_y = Math.floor(this.enemies[i][1]);

      // Surrounding tiles.
      let tile_nw = tile_x >= 0 && tile_y >= 0 ? this.tiles[tile_y][tile_x]
                                               : tile_obstacle;
      let tile_ne = tile_x < this.w - 1 && tile_y >= 0
                        ? this.tiles[tile_y][tile_x + 1]
                        : tile_obstacle;
      let tile_sw = tile_x >= 0 && tile_y < this.h - 1
                        ? this.tiles[tile_y + 1][tile_x]
                        : tile_obstacle;
      let tile_se = tile_x < this.w - 1 && tile_y < this.h - 1
                        ? this.tiles[tile_y + 1][tile_x + 1]
                        : tile_obstacle;

      // Hit flags.
      let hit_nw = tile_nw != tile_walkable;
      let hit_ne = tile_ne != tile_walkable;
      let hit_sw = tile_sw != tile_walkable;
      let hit_se = tile_se != tile_walkable;

      // Penetration lengths.
      let dn = Math.ceil(this.enemies[i][1]) - tile_y;
      let dw = Math.ceil(this.enemies[i][0]) - tile_x;
      let ds = tile_y - Math.floor(this.enemies[i][0]);
      let de = tile_x - Math.floor(this.enemies[i][1]);

      // Maximum penetration length.
      let d_max = Math.max(dn, dw, ds, de);

      // Check collisions and handle them.
      if (hit_nw && hit_ne && this.enemies[i][3] < 0) {
        this.enemies[i][3] *= -1;
        this.enemies[i][1] = Math.ceil(this.enemies[i][1]);
      } else if (hit_nw && hit_sw && this.enemies[i][2] < 0) {
        this.enemies[i][2] *= -1;
        this.enemies[i][0] = Math.ceil(this.enemies[i][0]);
      } else if (hit_sw && hit_se && this.enemies[i][3] > 0) {
        this.enemies[i][3] *= -1;
        this.enemies[i][1] = Math.floor(this.enemies[i][1]);
      } else if (hit_ne && hit_se && this.enemies[i][2] > 0) {
        this.enemies[i][2] *= -1;
        this.enemies[i][0] = Math.floor(this.enemies[i][0]);
      } else if (d_max == dn &&
                 (tile_nw != tile_walkable || tile_ne != tile_walkable) &&
                 this.enemies[i][3] < 0) {
        this.enemies[i][3] *= -1;
        this.enemies[i][1] = Math.ceil(this.enemies[i][0]);
      } else if (d_max == dw &&
                 (tile_nw != tile_walkable || tile_sw != tile_walkable) &&
                 this.enemies[i][2] < 0) {
        this.enemies[i][2] *= -1;
        this.enemies[i][0] = Math.ceil(this.enemies[i][0]);
      } else if (d_max == ds &&
                 (tile_sw != tile_walkable || tile_se != tile_walkable) &&
                 this.enemies[i][3] > 0) {
        this.enemies[i][3] *= -1;
        this.enemies[i][1] = Math.floor(this.enemies[i][1]);
      } else if (d_max == de &&
                 (tile_ne != tile_walkable || tile_se != tile_walkable) &&
                 this.enemies[i][2] > 0) {
        this.enemies[i][2] *= -1;
        this.enemies[i][0] = Math.floor(this.enemies[i][0]);
      }

      if (this.enemies[i][4] == ENEMY_DELETER) {
        if (hit_nw && tile_x > 0 && tile_y > 0) {
          this.tiles[tile_y][tile_x] = TILE_UNCLAIMED;
          this.claimed--;
        }

        if (hit_ne && tile_y > 0 && tile_x < this.w - 2) {
          this.tiles[tile_y][tile_x + 1] = TILE_UNCLAIMED;
          this.claimed--;
        }

        if (hit_sw && tile_x > 0 && tile_y < this.h - 2) {
          this.tiles[tile_y + 1][tile_x] = TILE_UNCLAIMED;
          this.claimed--;
        }

        if (hit_se && tile_x < this.w - 2 && tile_y < this.h - 2) {
          this.tiles[tile_y + 1][tile_x + 1] = TILE_UNCLAIMED;
          this.claimed--;
        }
      }

      else if (this.enemies[i][4] == ENEMY_NORMAL) {
        if ((hit_nw && tile_nw == TILE_LINE) ||
            (hit_ne && tile_ne == TILE_LINE) ||
            (hit_sw && tile_sw == TILE_LINE) ||
            (hit_se && tile_se == TILE_LINE)) {
          this.die();
          break;
        }
      }
    }
  };

  // Check collisions between enemies and player line.
  this.check_collisions = function() {
    let player_left = this.player_x;
    let player_right = this.player_x + 1;
    let player_top = this.player_y;
    let player_bottom = this.player_y + 1;

    for (let i = 0; i < this.enemies.length; ++i) {
      let tile_x = Math.floor(this.enemies[i][0]);
      let tile_y = Math.floor(this.enemies[i][1]);

      // Check if the enemy hit the player.
      if (this.enemies[i][4] != ENEMY_DELETER &&
          !(player_left >= this.enemies[i][0] + 1 ||
            player_right <= this.enemies[i][0] ||
            player_top >= this.enemies[i][1] + 1 ||
            player_bottom <= this.enemies[i][1])) {
        this.die();
        return;
      }

      // Check if enemy hit the line.
      if (this.tiles[tile_y][tile_x] == TILE_LINE) {
        this.die();
        return;
      }
    }
  };

  // Player death.
  this.die = function() {
    this.player_lives -= 1;

    if (this.player_lives > 0)
      this.state = STATE_PAUSE;
    else
      this.state = STATE_GAMEOVER;

    this.pause_time = Date.now();
  };

  // Respawn the enemies bouncing in the claimed area.
  this.respawn_enemies_claimed = function() {
    for (let i = 0; i < this.enemies.length; ++i) {
      if (this.enemies[i][4] != ENEMY_CLAIMED)
        continue;

      let x, y, theta;

      do {
        x = Math.floor(Math.random() * this.w);
        y = Math.floor(Math.random() * this.h);
      } while (this.tiles[y][x] != TILE_CLAIMED ||
               (x - this.player_x) * (x - this.player_x) +
                       (y - this.player_y) * (y - this.player_y) <
                   min_claimed_distance_from_player *
                       min_claimed_distance_from_player);

      do {
        theta = Math.random() * 2 * Math.PI;
      } while (Math.abs(theta) < enemy_minimum_steepness ||
               Math.abs(theta - Math.PI / 2) < enemy_minimum_steepness ||
               Math.abs(theta - Math.PI) < enemy_minimum_steepness ||
               Math.abs(theta - 3 * Math.PI / 2) < enemy_minimum_steepness ||
               Math.abs(theta - 2 * Math.PI) < enemy_minimum_steepness);
      let speed = enemy_speed + this.level * enemy_speed_increase_per_level;
      this.enemies[i] = [
        x, y, speed * Math.cos(theta), speed * Math.sin(theta), ENEMY_CLAIMED
      ];
    }
  };

  // Restore playing state after the player has been hit.
  this.start_new_life = function() {
    // Clear the line.
    for (let row = 0; row < this.h; ++row)
      for (let col = 0; col < this.w; ++col)
        if (this.tiles[row][col] == TILE_LINE)
          this.tiles[row][col] = TILE_UNCLAIMED;

    this.respawn_enemies_claimed();

    // Reset player position.
    this.player_x = Math.floor(this.w / 2);
    this.player_y = 0;
    this.player_direction = DIRECTION_IDLE;

    this.state = STATE_PLAYING;
  };

  // Move onto next level.
  this.start_new_level = function() {
    this.level++;
    this.t = 0;
    this.setup_field(this.w, this.h);

    this.player_x = Math.floor(this.w / 2);
    this.player_y = 0;
    this.player_direction = DIRECTION_IDLE;

    this.setup_enemies(n_initial_enemies +
                       (this.level - 1) * n_enemies_per_level);
    this.start_new_life();
  };

  // Draw method.
  this.draw = function(context) {
    context.fillStyle = color_unclaimed;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw the tiles.
    for (let row = 0; row < this.h; ++row) {
      for (let col = 0; col < this.w; ++col) {
        if (this.tiles[row][col] == TILE_UNCLAIMED)
          continue;

        switch (this.tiles[row][col]) {
        case TILE_CLAIMED:
          context.fillStyle = color_claimed;
          break;
        case TILE_LINE:
          context.fillStyle = color_line;
          break;
        }
        context.fillRect(col * tile_size, row * tile_size, tile_size,
                         tile_size);
      }
    }

    // Draw the player.
    switch (this.tiles[Math.floor(this.player_y)][Math.floor(this.player_x)]) {
    case TILE_CLAIMED:
      context.fillStyle = color_unclaimed;
      break;
    case TILE_UNCLAIMED:
    case TILE_LINE:
      context.fillStyle = color_claimed;
      break;
    }
    context.fillRect(Math.floor(this.player_x) * tile_size,
                     Math.floor(this.player_y) * tile_size, tile_size,
                     tile_size);

    // Draw the enemies.
    for (let i = 0; i < this.enemies.length; ++i) {
      switch (this.enemies[i][4]) {
      case ENEMY_NORMAL:
        context.fillStyle = color_enemy_normal;
        break;
      case ENEMY_DELETER:
        context.fillStyle = color_enemy_deleter;
        break;
      case ENEMY_CLAIMED:
        context.fillStyle = color_enemy_claimed;
        break;
      }

      context.fillRect(Math.floor(this.enemies[i][0] * tile_size),
                       Math.floor(this.enemies[i][1] * tile_size), tile_size,
                       tile_size);
    }
  };

  // Check for new claimed areas. Transforms all line tiles into claimed
  // tiles, and then claims all unclaimed areas that don't contain enemies.
  this.check_new_claimed_area = function() {
    let claimed_new = 0;

    // First, claim all the line tiles.
    for (let row = 0; row < this.h; ++row) {
      for (let col = 0; col < this.w; ++col) {
        if (this.tiles[row][col] == TILE_LINE) {
          this.tiles[row][col] = TILE_CLAIMED;
          claimed_new++;
        }
      }
    }

    // Then claim those tiles that cannot be reached by enemies. Such tiles are
    // computed by bucket-filling the tiles_to_claim using the enemies as seeds.
    for (let row = 0; row < this.h; ++row)
      for (let col = 0; col < this.w; ++col)
        this.tiles_to_claim[row][col] = true;

    // Place seeds in correspondence of enemies.
    for (let i = 0; i < this.enemies.length; ++i)
      if (this.enemies[i][4] != ENEMY_CLAIMED)
        this.tiles_to_claim[Math.floor(this.enemies[i][1])][Math.floor(
            this.enemies[i][0])] = false;

    // Bucket-fill.
    let changed = true;
    let count = 0;
    while (changed) {
      changed = false;
      ++count;
      for (let row = 0; row < this.h; ++row) {
        for (let col = 0; col < this.w; ++col) {
          if (!this.tiles_to_claim[row][col] ||
              this.tiles[row][col] == TILE_CLAIMED)
            continue;

          if ((row > 1 && !this.tiles_to_claim[row - 1][col]) ||
              (row < this.h - 1 && !this.tiles_to_claim[row + 1][col]) ||
              (col > 1 && !this.tiles_to_claim[row][col - 1]) ||
              (col < this.w - 1 && !this.tiles_to_claim[row][col + 1])) {
            this.tiles_to_claim[row][col] = false;
            changed = true;
          }
        }
      }
    }

    this.claimed = 0;

    // Transfer changes from tiles_to_claim to tiles
    for (let row = 0; row < this.h; ++row) {
      for (let col = 0; col < this.w; ++col) {
        if (this.tiles_to_claim[row][col] &&
            this.tiles[row][col] != TILE_CLAIMED) {
          this.tiles[row][col] = TILE_CLAIMED;
          claimed_new++;
        }
        if (this.tiles[row][col] == TILE_CLAIMED)
          this.claimed++;
      }
    }

    // Update score.
    this.player_score += Math.ceil(claimed_new * claimed_new /
                                   score_normalization_factor / this.t) *
                         Math.pow(2, this.level - 1);
    localStorage.hiscore_ = Math.max(this.player_score, localStorage.hiscore_);

    if (this.claimed / (this.w * this.h) > next_level_claimed) {
      this.state = STATE_PAUSE;
      this.pause_time = Date.now();
    }
  }
};

// GAME FLOW CONTROL ///////////////////////////////////////////////////////////

let main_canvas = 0;      // Game canvas.
let main_context = 0;     // Game canvas 2D context.
let status_canvas_1 = 0;  // Status canvas.
let status_context_1 = 0; // Status canvas 2D context.
let status_canvas_2 = 0;  // Status canvas.
let status_context_2 = 0; // Status canvas 2D context.

// Game field.
let field = 0;

// Bitmap font.
let bitfont = new BitmapFont(bitfont_alphabet, bitfont_characters,
                             bitfont_kerning, 3, 5, tile_size);

// Setup method.
let setup = function() {
  // Reset hiscore if not found.
  if (localStorage.hiscore_ == undefined)
    localStorage.hiscore_ = 0;

  // Retrieve canvas elements.
  main_canvas = document.getElementById("main-canvas");
  main_context = main_canvas.getContext("2d");
  status_canvas_1 = document.getElementById("status-canvas-1");
  status_context_1 = status_canvas_1.getContext("2d");
  status_canvas_2 = document.getElementById("status-canvas-2");
  status_context_2 = status_canvas_2.getContext("2d");

  // Setup game field.
  field = new Field();
  field.setup(main_canvas.width / tile_size, main_canvas.height / tile_size);

  // Register keydown events for player movement.
  document.onkeydown = function(e) {
    switch (field.state) {
    case STATE_PLAYING:
      let old_direction = field.player_direction;
      switch (e.code) {
      case "ArrowUp":
        field.player_direction = DIRECTION_N;
        break;
      case "ArrowLeft":
        field.player_direction = DIRECTION_W;
        break;
      case "ArrowDown":
        field.player_direction = DIRECTION_S;
        break;
      case "ArrowRight":
        field.player_direction = DIRECTION_E;
        break;
      case "KeyP":
        field.state = STATE_INGAME_PAUSE;
        field.pause_time = Date.now();
        break;
      }
      if (old_direction != field.player_direction) {
        field.player_x = Math.floor(field.player_x);
        field.player_y = Math.floor(field.player_y);
      }
      break;

    case STATE_PAUSE:
      if (Date.now() - field.pause_time > 1000 * delay_before_new_life) {
        if (field.claimed / (field.w * field.h) > next_level_claimed)
          field.start_new_level();
        else
          field.start_new_life();
      }
      break;

    case STATE_INGAME_PAUSE:
      if (Date.now() - field.pause_time > 1000 * delay_before_new_life)
        field.state = STATE_PLAYING;
      break;

    case STATE_GAMEOVER:
      if (Date.now() - field.pause_time > 1000 * delay_before_new_life) {
        field.setup(main_canvas.width / tile_size,
                    main_canvas.height / tile_size);
      }
      break;
    }
  };

  last_update_time = Date.now();
  setInterval(update, 1000 / fps);
  setInterval(draw, 1000 / fps);
};

// Update game state method.
let last_update_time = 0;
let update = function() {
  let t = Date.now();
  let dt = (t - last_update_time) / 1000 / n_sub_frames;

  for (i = 0; i < n_sub_frames; ++i)
    field.update(dt);

  last_update_time = t;
};

// Draw game method.
let draw = function() {
  field.draw(main_context);

  status_context_1.fillStyle = color_unclaimed;
  status_context_1.fillRect(0, 0, status_canvas_1.width,
                            status_canvas_1.height);
  status_context_2.fillStyle = color_unclaimed;
  status_context_2.fillRect(0, 0, status_canvas_2.width,
                            status_canvas_2.height);

  // Draw status 1
  let lives_str = "";
  for (let i = 0; i < field.player_lives; ++i)
    lives_str += "|";
  if (lives_str == "")
    lives_str = "game over";
  let claimed_str =
      Math.floor(field.claimed / (field.w * field.h) * 100).toString() + "%";
  let claimed_str_w = bitfont.string_width(claimed_str);
  let score_str = field.player_score.toString();
  let score_str_w = bitfont.string_width(score_str);

  bitfont.render_string(status_context_1, 0, 0, lives_str, color_claimed);
  bitfont.render_string(status_context_1, status_canvas_1.width - claimed_str_w,
                        0, claimed_str, color_claimed);
  bitfont.render_string(status_context_1,
                        Math.floor((status_canvas_1.width - score_str_w) / 2),
                        0, score_str, color_claimed);

  // Draw status 2
  let level_str = "level " + field.level.toString();
  let hiscore_str = "hiscore " + localStorage.hiscore_.toString();
  let hiscore_str_w = bitfont.string_width(hiscore_str);
  let time_str = "time " + Math.floor(field.t).toString();
  let time_str_w = bitfont.string_width(time_str);

  bitfont.render_string(status_context_2, 0, 0, level_str, color_claimed);
  bitfont.render_string(status_context_2, status_canvas_2.width - hiscore_str_w,
                        0, hiscore_str, color_claimed);
  bitfont.render_string(status_context_2,
                        Math.floor((status_canvas_2.width - time_str_w) / 2) -
                            70,
                        0, time_str, color_claimed);
};
