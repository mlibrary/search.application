import { addSelected, toggleAddSelected } from '../../../../../../assets/scripts/datastores/partials/actions/action/_add-selected.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('add selected', function () {
  let getTab = null;
  let getTabPanel = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__add-selected" aria-selected="true"></div>
      <div id="actions__add-selected--tabpanel" style="display: block;"></div>
    `;

    getTab = () => {
      return document.querySelector('#actions__add-selected');
    };

    getTabPanel = () => {
      return document.querySelector('#actions__add-selected--tabpanel');
    };
  });

  afterEach(function () {
    getTab = null;
    getTabPanel = null;
  });

  describe('toggleAddSelected()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        isAdded: false,
        isTemporaryList: false
      };

      // Check that the tab has `aria-selected` set
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('true');

      // Check that the tab does not have `style` set
      expect(getTab().getAttribute('style'), '`style` should not be set on the tab').to.equal(null);

      // Check that the tabpanel has `display` set
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('block');
    });

    it('should show the action when not viewing the temporary list and not already added', function () {
      // Check that `isAdded` is false
      expect(args.isAdded).to.be.false;

      // Check that `isTemporaryList` is false
      expect(args.isTemporaryList).to.be.false;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to true
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('true');

      // Check that the tab does not have `style` set
      expect(getTab().getAttribute('style'), '`style` should not be set on the tab').to.equal(null);

      // Check that the tabpanel is displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('block');
    });

    it('should not show the action when not viewing the temporary list and is already added', function () {
      // Check that `isAdded` is true
      args.isAdded = true;
      expect(args.isAdded).to.be.true;

      // Check that `isTemporaryList` is false
      expect(args.isTemporaryList).to.be.false;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to false
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('false');

      // Check that the tab is not displaying
      expect(getTab().style.display, '`display` should be set on the tab').to.equal('none');

      // Check that the tabpanel is not displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('none');
    });

    it('should not show the action when viewing the temporary list and is already added', function () {
      // Check that `isAdded` is true
      args.isAdded = true;
      expect(args.isAdded).to.be.true;

      // Check that `isTemporaryList` is true
      args.isTemporaryList = true;
      expect(args.isTemporaryList).to.be.true;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to false
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('false');

      // Check that the tab is not displaying
      expect(getTab().style.display, '`display` should be set on the tab').to.equal('none');

      // Check that the tabpanel is not displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('none');
    });
  });

  describe('addSelected()', function () {
    it('should call toggleAddSelected()', function () {
      // Create spy for the toggleAction function
      const toggleSpy = sinon.spy();

      // Call the function
      addSelected({ toggleAction: toggleSpy });

      // Check that the toggleAction function was called once with the correct arguments
      expect(toggleSpy.calledOnceWithExactly({ isAdded: false }), '`toggleAction` should be called once with the correct arguments').to.be.true;
    });
  });
});
