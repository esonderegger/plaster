import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import itunesCategories from './itunes-categories.js';

export default class PodcastCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.closeSelf = this.closeSelf.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.toggleSubCategory = this.toggleSubCategory.bind(this);
    this.categoryCheckboxArray = this.categoryCheckboxArray.bind(this);
    this.subCategoryCheckboxArray = this.subCategoryCheckboxArray.bind(this);
  }
  closeSelf() {
    this.props.close();
  }
  toggleCategory(e, v, cName) {
    var newCats = {};
    if (v) {
      newCats = this.addCategory(this.props.categories, cName);
    } else {
      newCats = this.removeCategory(this.props.categories, cName);
    }
    this.props.handleChange('categories', newCats);
  }
  toggleSubCategory(e, v, cName, scName) {
    var newCats = {};
    if (v) {
      newCats = this.addSubCategory(this.props.categories, cName, scName);
    } else {
      newCats = this.removeSubCategory(this.props.categories, cName, scName);
    }
    this.props.handleChange('categories', newCats);
  }
  addCategory(originalCategories, cName) {
    var categoriesCopy = JSON.parse(JSON.stringify(originalCategories));
    for (var i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].categoryName === cName) {
        return categoriesCopy;
      }
    }
    categoriesCopy.push({
      categoryName: cName,
      subCategories: []
    });
    return categoriesCopy;
  }
  removeCategory(originalCategories, cName) {
    var categoriesCopy = JSON.parse(JSON.stringify(originalCategories));
    var indexToSplice = -1;
    for (var i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].categoryName === cName) {
        indexToSplice = i;
      }
    }
    if (indexToSplice > -1) {
      categoriesCopy.splice(indexToSplice, 1);
    }
    return categoriesCopy;
  }
  addSubCategory(originalCategories, cName, scName) {
    var categoriesCopy = this.addCategory(originalCategories, cName);
    for (var i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].categoryName === cName) {
        categoriesCopy[i].subCategories.push(scName);
      }
    }
    return categoriesCopy;
  }
  removeSubCategory(originalCategories, cName, scName) {
    var categoriesCopy = JSON.parse(JSON.stringify(originalCategories));
    var cToSplice = -1;
    var scToSplice = -1;
    for (var i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].categoryName === cName) {
        cToSplice = i;
        for (var j = 0; j < categoriesCopy[i].subCategories.length; j++) {
          if (categoriesCopy[i].subCategories[j] === scName) {
            scToSplice = j;
          }
        }
      }
    }
    if (cToSplice > -1 && scToSplice > -1) {
      categoriesCopy[cToSplice].subCategories.splice(scToSplice, 1);
    }
    return categoriesCopy;
  }
  categoryCheckboxArray() {
    var propsCategories = this.props.categories;
    return itunesCategories.categories.map(function(category) {
      for (var i = 0; i < propsCategories.length; i++) {
        if (propsCategories[i].categoryName === category.categoryName) {
          return true;
        }
      }
      return false;
    });
  }
  subCategoryCheckboxArray() {
    var propsCategories = this.props.categories;
    return itunesCategories.categories.map(function(category) {
      return category.subCategories.map(function(subcategory) {
        for (var i = 0; i < propsCategories.length; i++) {
          if (propsCategories[i].categoryName === category.categoryName) {
            for (var j = 0; j < propsCategories[i].subCategories.length; j++) {
              if (propsCategories[i].subCategories[j] === subcategory) {
                return true;
              }
            }
          }
        }
        return false;
      });
    });
  }
  render() {
    var outerThis = this;
    var categoryArray = this.categoryCheckboxArray();
    var subCategoryArray = this.subCategoryCheckboxArray();
    const actions = [
      <FlatButton
        label="Close"
        primary={false}
        onTouchTap={this.closeSelf}
      />
    ];
    return (
        <Dialog
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.closeSelf}
          autoScrollBodyContent={true}
        >
          <div className="podcast-categories-dialog">
          {
            itunesCategories.categories.map(function(category, i) {
              return (
                <div className="category-checkbox-group">
                  <Checkbox key={i}
                    label={category.categoryName}
                    checked={categoryArray[i]}
                    onCheck={(e, v) => outerThis.toggleCategory(
                      e,
                      v,
                      category.categoryName
                    )}
                  />
                  <div className="subcategories-group">
                  {
                    category.subCategories.map(function(subCategory, j) {
                      return (
                        <Checkbox key={j}
                          label={subCategory}
                          checked={subCategoryArray[i][j]}
                          onCheck={(e, v) => outerThis.toggleSubCategory(
                              e,
                              v,
                              category.categoryName,
                              subCategory
                            )}
                        />
                      );
                    })
                  }
                  </div>
                </div>
              );
            })
          }
          </div>
        </Dialog>
    );
  }
}
