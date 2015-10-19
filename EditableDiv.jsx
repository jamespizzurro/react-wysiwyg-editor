'use strict';
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;

module.exports = React.createClass({
	displayName: 'EditableDiv',

	propTypes: {
		content: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		// this is anti-pattern but we treat this.props.content as initial content
		return {
			html: this.props.content
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			html: nextProps.content
		});
	},

	shouldComponentUpdate: function(nextProps) {
		return nextProps.content !== this.state.html;
	},

	_execCommand: function(command, arg) {
		document.execCommand(command, false, arg);
	},

	_emitChange: function() {
		var editor = this.refs.editor.getDOMNode();
		var newHtml = editor.innerHTML;

		this.setState({html: newHtml}, function() {
			this.props.onChange({
				target: {
					value: newHtml
				}
			});
		}.bind(this));
	},

	render: function() {
		// customize css rules here
		var toolbarStyle = {marginBottom: 3};

		return (
			<div>
				<div style={toolbarStyle}>
					<ButtonGroup>
						<DropdownButton title={<i className="fa fa-paragraph"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'P')}>Paragraph</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE')}>Block Quote</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H1')}>Header 1</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H2')}>Header 2</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H3')}>Header 3</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H4')}>Header 4</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H5')}>Header 5</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H6')}>Header 6</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'bold')}>
							<i className="fa fa-bold"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'italic')}>
							<i className="fa fa-italic"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'underline')}>
							<i className="fa fa-underline"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'strikeThrough')}>
							<i className="fa fa-strikethrough"></i>
						</Button>
						<DropdownButton title={<i className="fa fa-text-height"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 1)}>1</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 2)}>2</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 3)}>3</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 4)}>4</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 5)}>5</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 6)}>6</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 7)}>7</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'insertOrderedList')}>
							<i className="fa fa-list-ol"></i>	
						</Button>
						<Button onClick={this._execCommand.bind(this, 'insertUnorderedList')}>
							<i className="fa fa-list-ul"></i>	
						</Button>
						<DropdownButton title={<i className="fa fa-align-left"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyLeft')}>Align Left</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyRight')}>Align Right</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyCenter')}>Align Center</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyFull')}>Align Justify</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'removeFormat')}>
							<i className="fa fa-eraser"></i>
						</Button>
					</ButtonGroup>
				</div>
				<div
					ref="editor"
					className="form-control"
					{...this.props} 
					contentEditable="true"
					dangerouslySetInnerHTML={{__html: this.state.html}}
					onInput={this._emitChange}/>
			</div>
		);
	}
});
