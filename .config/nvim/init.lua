-- [[ init.lua ]]

-- LEADER
vim.g.mapleader = " "
vim.g.localleader = "\\"

-- IMPORTS
require('vars')      -- Variables
require('plug')      -- Plugins
require('opts')      -- Options
require('keys')      -- Keymaps

-- PLUGINS
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
require('lualine').setup {
  options = {
    theme = 'tokyonight'
  }
}

require('nvim-autopairs').setup{}


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
