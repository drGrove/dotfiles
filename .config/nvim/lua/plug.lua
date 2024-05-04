local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

local plugins = {
  -- [Editor]
  "b0o/mapx.nvim",
  "gpanders/editorconfig.nvim",
  -- [Theme]
  -- the colorscheme should be available when starting Neovim
  {
    "folke/tokyonight.nvim",
    lazy = false, -- make sure we load this during startup if it is your main colorscheme
    priority = 1000, -- make sure to load this before all the other start plugins
    config = function()
      -- load the colorscheme here
      vim.cmd([[colorscheme tokyonight]])
    end,
  },
  "mhinz/vim-startify",
  "DanilaMihailov/beacon.nvim",
  {
    "kyazdani42/nvim-tree.lua",
    dependencies = {
      "kyazdani42/nvim-web-devicons"
    }
  },
  {
    "nvim-lualine/lualine.nvim",
    dependencies = {
      "kyazdani42/nvim-web-devicons"
    }
  },
  -- [[ Dev ]]
  {
    "nvim-telescope/telescope.nvim",         -- fuzzy finder
    dependencies = {"nvim-lua/plenary.nvim"}
  },
  "majutsushi/tagbar",                       -- code structure
  "Yggdroot/indentLine",                     -- see indentation
  "tpope/vim-fugitive",                      -- git integration
  "junegunn/gv.vim",                         -- commit history
  "windwp/nvim-autopairs",                   -- auto close brackets, etc.
  
  -- [[ Languages ]]
  "google/vim-jsonnet",
  "jamessan/vim-gnupg",
}

require("lazy").setup(plugins, opts)
