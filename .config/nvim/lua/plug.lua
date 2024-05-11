local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
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
  -- [Theme]
  -- the colorscheme should be available when starting Neovim
  {
    "folke/tokyonight.nvim",
    lazy = false, -- make sure we load this during startup if it is your main colorscheme
    priority = 1000, -- make sure to load this before all the other start plugins
    config = function()
      -- load the colorscheme here
      vim.cmd([[colorscheme tokyonight-night]])
    end,
  },
  -- [Editor]
  "b0o/mapx.nvim",
  "gpanders/editorconfig.nvim",
  "mhinz/vim-startify",
  "DanilaMihailov/beacon.nvim",
  {
    "kyazdani42/nvim-web-devicons",
    config = function()
      require('nvim-web-devicons').setup {
       -- your personnal icons can go here (to override)
       -- you can specify color or cterm_color instead of specifying both of them
       -- DevIcon will be appended to `name`
       override = {
        zsh = {
          icon = "",
          color = "#428850",
          cterm_color = "65",
          name = "Zsh"
        }
       };
       -- globally enable different highlight colors per icon (default to true)
       -- if set to false all icons will have the default icon's color
       color_icons = true;
       -- globally enable default icons (default to false)
       -- will get overriden by `get_icons` option
       default = true;
       -- globally enable "strict" selection of icons - icon will be looked up in
       -- different tables, first by filename, and if not found by extension; this
       -- prevents cases when file doesn't have any extension but still gets some icon
       -- because its name happened to match some extension (default to false)
       strict = true;
       -- same as `override` but specifically for overrides by filename
       -- takes effect when `strict` is true
       override_by_filename = {
        [".gitignore"] = {
          icon = "",
          color = "#f1502f",
          name = "Gitignore"
        }
       };
       -- same as `override` but specifically for overrides by extension
       -- takes effect when `strict` is true
       override_by_extension = {
        ["log"] = {
          icon = "",
          color = "#81e043",
          name = "Log"
        }
       };
      }
    end,
  },
  {
    "kyazdani42/nvim-tree.lua",
    dependencies = {
      "kyazdani42/nvim-web-devicons"
    },
    config = function()
      require('nvim-tree').setup({
        respect_buf_cwd = true,
        sort = {
          sorter = "case_sensitive",
        },
        tab = {
          sync = {
            open = true,
          }
        },
        renderer = {
          group_empty = true,
        },
        view = {
          width = 30,
        },
      })
    end,
  },
  {
    "nvim-lualine/lualine.nvim",
    dependencies = {
      "kyazdani42/nvim-web-devicons"
    },
    config = function()
      require('lualine').setup {
        options = {
          theme = 'tokyonight'
        }
      }
    end,
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
  {
    "windwp/nvim-autopairs",                   -- auto close brackets, etc.
    config = function()
      require('nvim-autopairs').setup{}
    end,
  },

  -- [[ Languages ]]
  "google/vim-jsonnet",
  "jamessan/vim-gnupg",
  -- Language Support
  -- Added this plugin.
  {
    'VonHeikemen/lsp-zero.nvim',
    branch = 'v3.x',
    dependencies = {
      -- LSP Support
      {'neovim/nvim-lspconfig'},             -- Required
      {'williamboman/mason.nvim'},           -- Optional
      {'williamboman/mason-lspconfig.nvim'}, -- Optional

      -- Autocompletion
      {'hrsh7th/nvim-cmp'},         -- Required
      {'hrsh7th/cmp-nvim-lsp'},     -- Required
      {'hrsh7th/cmp-buffer'},       -- Optional
      {'hrsh7th/cmp-path'},         -- Optional
      {'saadparwaiz1/cmp_luasnip'}, -- Optional
      {'hrsh7th/cmp-nvim-lua'},     -- Optional

      -- Snippets
      {'L3MON4D3/LuaSnip'},             -- Required
      {'rafamadriz/friendly-snippets'}, -- Optional
    },
    config = function()
      local lsp_zero = require('lsp-zero')
      lsp_zero.on_attach(function(client, bufnr)
        -- see :help lsp-zero-keybindings
        -- to learn the available actions
        lsp_zero.default_keymaps({buffer = bufnr})
      end)

      -- to learn how to use mason.nvim
      -- read this: https://github.com/VonHeikemen/lsp-zero.nvim/blob/v3.x/doc/md/guide/integrate-with-mason-nvim.md
      require('mason').setup({})
      require('mason-lspconfig').setup({
        ensure_installed = {
          'autotools_ls', -- make
          'cmake', -- cmake
          'dockerls', -- docker
          'gopls', -- go
          'jedi_language_server', -- python
          'jqls', -- jq
          'jsonnet_ls', -- jsonnet
          'kotlin_language_server', -- kotlin
          'lua_ls', -- lua
          'rust_analyzer', -- rust
          'sqls', -- sql
          'taplo', -- toml
          'terraformls', -- terraform
          'tflint', -- terraform
          'tsserver', -- typescript
          'vimls', -- vim
          'yamlls', -- yaml
          'zk', -- markdown
          'zls', -- zig
        },
        handlers = {
          function(server_name)
            require('lspconfig')[server_name].setup({})
          end,
        },
      })
    end,
  },
   -- Treesitter
  {
    "nvim-treesitter/nvim-treesitter",
  },
}

require("lazy").setup(plugins)
