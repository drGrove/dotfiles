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

-- Remove trailing whitespace
vim.api.nvim_create_autocmd({ "BufWritePre" }, {
  pattern = { "*" },
  command = [[%s/\s\+$//e]],
})

local function flatten(v)
  local res = {}
  local function flatten(v)
    if type(v) ~= "table" then
      table.insert(res,v)
      return
    end
    for _, v in ipairs(v) do
      flatten(v)
    end
  end
  flatten(v)
  return res
end

local function get_lsp()
  local docker = {
    'dockerls',
  }

  local make = {
    'autotools_ls',
    'cmake',
  }

  local python = {
    'jedi_lan'
  }

  local go = {
    'gopls',
  }

  local yaml = {
    'yamlls',
  }

  local helmls = {
    'helm-ls'
  }

  local jq = {
    'jqls',
  }

  local terraform = {
    'tflint',
    'terraformls',
  }

  local jsonnet = {
    'jsonnet_ls', -- jsonnet
  }
  local kotlin = {
    'kotlin_language_server', -- kotlin
  }

  local lua = {
    'lua_ls', -- lua
  }

  local rust = {
    'rust_analyzer', -- rust
  }

  local js = {
    'tsserver', -- typescript
  }

  local sql = {
    'sqls', -- sql
  }

  local zig = {
    'zls', -- zig
  }

  local text = {
    'taplo', -- toml
    'vimls', -- vim
    'yamlls', -- yaml
    'zk', -- markdown
  }

  local final = {}

  if vim.env.HOSTNAME == "neuromancer" then
    return flatten({
      docker,
      go,
      helmls,
      js,
      lua,
      terraform,
      text,
      yaml,
    })
  elseif vim.env.HOSTNAME == "personal" then
    return flatten({
      docker,
      js,
      lua,
      terraform,
      text,
      yaml,
    })
  elseif vim.env.HOSTNAE == "tardis" then
    return flatten({
      docker,
      go,
      jq,
      js,
      jsonnet,
      kotlin,
      lua,
      make,
      python,
      rust,
      sql,
      terraform,
      text,
      yaml,
      zig,
    })
  end
end



local plugins = {
  -- [Lazy]
  {
    "LazyVim/LazyVim",
  },
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
    "nvim-tree/nvim-tree.lua",
    dependencies = {
      "kyazdani42/nvim-web-devicons"
    },
    lazy = false,
    config = function()
      require('nvim-tree').setup {
        auto_reload_on_write = true,
        git  = {
          enable = true,
        },
        modified = {
          enable = true,
        },
        renderer = {
          highlight_opened_files = "icon",
          highlight_modified = "name",
          highlight_git = true,
          icons = {
            show = {
              git = true,
            },
          },
        }
      }
      require('nvim-tree.api').tree.toggle({ focus = false, find_file = true });
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

  -- [[ AI ]]
  -- {
  --   "zbirenbaum/copilot.lua",
  --   cmd = "Copilot",
  --   event = "InsertEnter",
  --   config = function()
  --     require("copilot").setup({
  --       suggestion = { enabled = false },
  --       panel = { enabled = false },
  --     })
  --   end,
  --   filetypes = {
  --     markdown = true,
  --     go = true,
  --     javascript = true,
  --     typescript = true,
  --     lua = true,
  --   },
  --   workspace_folders = {
  --     "~/code/github.com/manifest-cyber/"
  --   },
  -- },
  -- {
  --   "zbirenbaum/copilot-cmp",
  --   dependencies = { "copilot.lua" },
  --   config = function()
  --     require("copilot_cmp").setup()
  --   end
  -- },

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
      {'neovim/nvim-lspconfig'},
      {'williamboman/mason.nvim'},
      {'williamboman/mason-lspconfig.nvim'},

      -- Autocompletion
      {
        'hrsh7th/nvim-cmp',
        sources = {
        },
      },         -- Required
      {'hrsh7th/cmp-nvim-lsp'},     -- Required
      {'hrsh7th/cmp-buffer'},       -- Optional
      {'hrsh7th/cmp-path'},         -- Optional
      {'saadparwaiz1/cmp_luasnip'}, -- Optional
      {'hrsh7th/cmp-nvim-lua'},     -- Optional
      {'diogo464/kubernetes.nvim'},

      -- Snippets
      {'L3MON4D3/LuaSnip'},
      {'rafamadriz/friendly-snippets'},
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
        ensure_installed = get_lsp(),
        handlers = {
          function(server_name)
            -- Convert hyphens to underscores for settings lookup
            local settings_key = server_name:gsub("-", "_")
            local settings = lsp_settings[settings_key] or {}
            require('lspconfig')[server_name].setup(settings)
          end,
        },
      })

      -- Completion
      local cmp = require('cmp')
      cmp.setup({
        mapping = cmp.mapping.preset.insert({
          ['<C-b>'] = cmp.mapping.scroll_docs(-4),
          ['<C-f>'] = cmp.mapping.scroll_docs(4),
          ['<C-Space>'] = cmp.mapping.complete(),
          ['<C-e>'] = cmp.mapping.abort(),
          ['<CR>'] = cmp.mapping.confirm({ select = true }), -- Accept the currently selectd item.
        }),
        sources = {
          -- Copilot sources
          -- { name = "copilot", group_index = 2 },
          -- Other sources
          { name = "nvim_lsp", group_index = 2 },
          { name = "path", group_index = 2 },
          { name = "luasnip", group_index = 2 },
        }
      })
    end,
  },
  -- yaml
  {
    "cuducos/yaml.nvim",
    ft = { "yaml" }, -- optional
    dependencies = {
      "nvim-treesitter/nvim-treesitter",
      "folke/snacks.nvim", -- optional
      "nvim-telescope/telescope.nvim", -- optional
      "ibhagwan/fzf-lua" -- optional
    },
  },
   -- Treesitter
  {
    "nvim-treesitter/nvim-treesitter",
    ensure_installed = { "go", "gptmpl" },
    highlight = {
      enable = true,
    }
  },
  --- Markdown Preview
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    build = "cd app && yarn install",
    init = function()
      vim.g.mkdp_filetypes = { "markdown" }
      vim.g.mkdp_browser = 'firefox'
    end,
    ft = { "markdown" },
  },
}

require("lazy").setup(plugins)
