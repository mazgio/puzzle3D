# frozen_string_literal: true

# This module includes shared methods for the Game class and the main application.
# It provides functionality for randomizing the puzzle, moving blocks, and checking
# whether a block can be moved. It also includes methods for positioning blocks at
# specific coordinates.
module GameModule
  # Method to randomize the puzzle
  def randomize(iteration_count)
    iteration_count.times do
      random_block_idx = rand(@count)
      move_block(random_block_idx) unless move_block(random_block_idx).nil?
    end
  end

  # Method to move a block
  def move_block(block_idx)
    block = @blocks[block_idx]
    block_coords = can_move_block(block)
    return false if block_coords.nil?

    position_block_at_coord(block_idx, *@empty_block_coords)
    @indexes[@empty_block_coords[0] + @empty_block_coords[1] * @cols] =
      @indexes[block_coords[0] + block_coords[1] * @cols]
    @empty_block_coords = block_coords.dup
    true
  end

  # Method to check if a block can be moved
  def can_move_block(block)
    block_pos = block_position(block)
    block_coords = calculate_block_coords(block_pos)
    diff = calculate_coords_diff(block_coords)

    return block_coords if valid_move_diff?(diff)

    nil
  end

  private

  # Method to get the position of a block
  def block_position(block)
    [block.left, block.top]
  end

  # Method to calculate block coordinates
  def calculate_block_coords(block_pos)
    block_width = block.width
    [block_pos[0] / block_width, block_pos[1] / block_width]
  end

  # Method to calculate coordinates difference
  def calculate_coords_diff(block_coords)
    [
      (block_coords[0] - @empty_block_coords[0]).abs,
      (block_coords[1] - @empty_block_coords[1]).abs
    ]
  end

  # Method to check if the move difference is valid
  def valid_move_diff?(diff)
    (diff[0] == 1 && diff[1].zero?) || (diff[0].zero? && diff[1] == 1)
  end

  # Method to position a block at specific coordinates
  def position_block_at_coord(block_idx, x_coordinate, y_coordinate)
    block = @blocks[block_idx]
    block.left = x_coordinate * (100 / @cols)
    block.top = y_coordinate * (100 / @rows)
  end
end
